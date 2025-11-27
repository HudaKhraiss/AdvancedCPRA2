#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CPRA Calculator (Kuwait Donor Dataset)
--------------------------------------
Computes Calculated Panel Reactive Antibody (CPRA) using allele-frequency
method per locus with Hardy–Weinberg and independence across loci.
Optionally weights by donor ethnic/nationality composition.

Inputs:
- Excel file with HLA typings: two columns per locus (e.g., "HLA A SET1", "HLA A SET2"/"SET12").
  Expected loci supported: A, B, C, DRB1, DRB3, DRB4, DRB5, DQB1, DQA1, DPA1, DPB1.
- Optional group column (e.g., "NATIONALITY") for ethnicity-weighted CPRA.

Unacceptable antigens format:
- Dictionary mapping locus -> iterable of antigen codes (int). Example:
    unacceptable = {"A": [2,24], "B":[51], "DRB1":[7]}
  (Codes must match your sheet values: A=2 means A2, B=51 means B51, etc.)

Formula:
- For locus L with allele frequencies p_i and unacceptable set U_L:
    P(no unacceptable at locus L) = (1 - sum_{u in U_L} p_u)^2
  (HWE genotype assumption; ignores linkage between loci.)
- Overall CPRA (no ethnic weighting):
    CPRA = 1 - Π_L P(no unacceptable at L)
- With ethnic weights w_e and per-ethnicity allele freqs p_{e,L,u}:
    CPRA = Σ_e w_e * (1 - Π_L (1 - Σ_{u∈U_L} p_{e,L,u})^2)

Author: ChatGPT
Date: 2025-08-27
"""

from __future__ import annotations
import pandas as pd
from collections import defaultdict
from typing import Dict, Iterable, Optional, Tuple

# ---------- Configuration ----------

# Default mapping of loci to column-name patterns to search for (two allele columns per locus)
# We match flexibly to handle spacing/typos like "SET12" vs "SET 2".
DEFAULT_LOCUS_PATTERNS = {
    "A":    ["HLA A SET1", "HLA A SET2", "HLA A SET12"],
    "B":    ["HLA B SET1", "HLA B SET2"],
    "C":    ["HLA C SET1", "HLA C SET2"],
    "DRB1": ["HLA DRB1 SET1", "HLA DRB1 SET 2", "HLA DRB1 SET2"],
    "DRB3": ["HLA DRB3 SET1", "HLA DRB3 SET2"],
    "DRB4": ["HLA DRB4 SET1", "HLA DRB4 SET2"],
    "DRB5": ["HLA DRB5 SET1", "HLA DRB5 SET2"],
    "DQB1": ["HLA DQB1 SET1", "HLA DQB1 SET2"],
    "DQA1": ["HLA DQA1 SET1", "HLA DQA1 SET2"],
    "DPA1": ["HLA DPA1 SET1", "HLA DPA1 SET2"],
    "DPB1": ["HLA DPB1 SET1", "HLA DPB1 SET2"],
}

# ---------- Helpers ----------

def _find_two_columns(df: pd.DataFrame, candidates: Iterable[str]) -> Optional[Tuple[str, str]]:
    """Return the best-matching pair of columns for a locus from candidate names."""
    cols = list(df.columns)
    hits = [c for c in candidates if c in cols]
    # Accept exact pairs if available
    if len(hits) >= 2:
        # Prefer the first two matching candidates in the given order
        return hits[0], hits[1]
    # Fallback: try to infer 'SET1' and 'SET2' variants case-insensitively
    norm = {c.lower().replace(" ", ""): c for c in cols}
    set1 = [norm[k] for k in norm if "set1" in k and "hla" in k]
    set2 = [norm[k] for k in norm if ("set2" in k or "set12" in k) and "hla" in k]
    if set1 and set2:
        return set1[0], set2[0]
    return None

def compute_allele_frequencies(
    df: pd.DataFrame,
    group_col: Optional[str] = None,
    locus_patterns: Dict[str, Iterable[str]] = DEFAULT_LOCUS_PATTERNS,
) -> Dict[str, Dict[str, Dict[int, float]]]:
    """
    Compute per-locus allele frequencies from two-allele columns.
    Returns: freqs[locus][group]['allele_code'] = frequency in [0,1]
    If group_col is None, a single group name 'ALL' is used.
    """
    # Determine groups
    if group_col and group_col in df.columns:
        groups = df[group_col].astype(str).fillna("UNKNOWN")
    else:
        groups = pd.Series(["ALL"] * len(df), index=df.index)
        group_col = None

    # Prepare result
    freqs: Dict[str, Dict[str, Dict[int, float]]] = defaultdict(lambda: defaultdict(dict))

    for locus, candidates in locus_patterns.items():
        cols_pair = _find_two_columns(df, candidates)
        if not cols_pair:
            # Locus not present; skip
            continue
        c1, c2 = cols_pair

        # Cast to numeric codes, ignore non-numeric silently
        sub = df[[c1, c2]].apply(pd.to_numeric, errors="coerce")
        # Build per-group allele counts
        for gname, idx in groups.groupby(groups).groups.items():
            subg = sub.loc[idx]
            n_alleles = subg.notna().sum().sum()  # total observed alleles (2 per complete row)
            if n_alleles == 0:
                continue
            counts = defaultdict(int)
            # Count occurrences across both columns
            for val in subg[c1].dropna().astype(int):
                counts[int(val)] += 1
            for val in subg[c2].dropna().astype(int):
                counts[int(val)] += 1
            # Convert to frequencies
            denom = float(n_alleles)
            for allele_code, cnt in counts.items():
                freqs[locus][gname][allele_code] = cnt / denom

            # Normalize (in case of rounding) so sum = ~1.0 over observed alleles
            s = sum(freqs[locus][gname].values())
            if s > 0:
                for k in list(freqs[locus][gname].keys()):
                    freqs[locus][gname][k] = freqs[locus][gname][k] / s

    return freqs

def cpra_from_unacceptable(
    unacceptable: Dict[str, Iterable[int]],
    freqs: Dict[str, Dict[str, Dict[int, float]]],
    ethnic_weights: Optional[Dict[str, float]] = None,
) -> float:
    """
    Compute CPRA in [0,1] using allele frequencies and HWE per locus.
    - unacceptable: dict[locus] -> iterable of antigen codes (ints)
    - freqs: freqs[locus][group][allele_code] = frequency
    - ethnic_weights: optional dict[group] -> weight (must sum to 1). If None,
      uses 'ALL' group if present; else averages equally over available groups.

    Returns: CPRA proportion (e.g., 0.31 means 31%)
    """
    # Determine groups to use
    # If 'ALL' available and no weights supplied, use ALL only.
    has_all = any('ALL' in freqs.get(l, {}) for l in freqs)
    groups = set()
    for locus in freqs:
        for g in freqs[locus].keys():
            groups.add(g)
    groups = sorted(groups)

    if ethnic_weights is None:
        if has_all:
            ethnic_weights = {'ALL': 1.0}
            groups = ['ALL']
        else:
            # Equal weights across observed groups
            w = 1.0 / len(groups) if groups else 1.0
            ethnic_weights = {g: w for g in groups}

    # Normalize weights
    total_w = sum(ethnic_weights.values())
    if total_w <= 0:
        raise ValueError("Ethnic weights must sum to a positive value.")
    ethnic_weights = {g: w/total_w for g, w in ethnic_weights.items()}

    # Compute weighted CPRA
    cpra_weighted = 0.0
    for g, w in ethnic_weights.items():
        # Probability of *no unacceptable antigens* across all loci in group g
        p_no_any = 1.0
        for locus, group_map in freqs.items():
            # set of unacceptable antigens at this locus
            U = set(int(x) for x in unacceptable.get(locus, []) if x is not None)
            if not U:
                continue
            # sum of unacceptable allele freqs in this group
            pmap = group_map.get(g) or group_map.get('ALL') or {}
            p_unacc = sum(pmap.get(u, 0.0) for u in U)
            # Bound to [0,1]
            p_unacc = max(0.0, min(1.0, p_unacc))
            # HWE: P(no unacceptable at this locus) = (1 - p_unacc)^2
            p_no_locus = (1.0 - p_unacc) ** 2
            p_no_any *= p_no_locus
        cpra_g = 1.0 - p_no_any
        cpra_weighted += w * cpra_g

    return cpra_weighted

def build_ethnic_weights_from_counts(df: pd.DataFrame, group_col: str = "NATIONALITY") -> Dict[str, float]:
    """Derive weights from donor counts per nationality (proportional)."""
    if group_col not in df.columns:
        return {"ALL": 1.0}
    counts = df[group_col].astype(str).value_counts(dropna=False)
    total = counts.sum()
    return {k: float(v)/float(total) for k, v in counts.to_dict().items()}

# ---------- Example usage ----------

if __name__ == "__main__":
    import argparse, json, sys, textwrap

    parser = argparse.ArgumentParser(
        description="Compute CPRA using Kuwait HLA dataset (allele-frequency method).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent(\"\"\"
        Examples:
          # Basic (no ethnicity weighting; uses ALL group if available)
          python cpra_calculator_kuwait.py --xlsx "HLA Data.xlsx" --sheet Sheet1 --unacc '{"A":[2], "B":[51], "DRB1":[7]}'

          # With nationality weighting derived from the dataset distribution
          python cpra_calculator_kuwait.py --xlsx "HLA Data.xlsx" --sheet Sheet1 --unacc '{"A":[2,24], "B":[51]}' --weight_by NATIONALITY

          # With explicit ethnicity weights
          python cpra_calculator_kuwait.py --xlsx "HLA Data.xlsx" --sheet Sheet1 --unacc '{"A":[2], "B":[51]}' --weights '{"Emirati":0.35,"Other Arabs":0.35,"South Asian":0.2,"Southeast Asian":0.08,"Other":0.02}'
        \"\"\"),
    )
    parser.add_argument("--xlsx", required=True, help="Path to Excel file with HLA typings")
    parser.add_argument("--sheet", default=0, help="Excel sheet name or index")
    parser.add_argument("--group_col", default="NATIONALITY", help="Grouping column for ethnicity (optional)")
    parser.add_argument("--unacc", required=True, help="JSON string of unacceptable antigens per locus, e.g., '{\"A\":[2],\"B\":[51]}'")
    parser.add_argument("--weights", default=None, help="JSON dict of ethnicity weights, e.g., '{\"Emirati\":0.35, ... }'")
    parser.add_argument("--weight_by", default=None, help="Column to derive weights from counts (e.g., 'NATIONALITY'). Overrides --weights.")
    args = parser.parse_args()

    # Load data
    try:
        df = pd.read_excel(args.xlsx, sheet_name=args.sheet)
    except Exception as e:
        print(f"ERROR: failed to read Excel: {e}", file=sys.stderr)
        sys.exit(1)

    # Compute allele frequencies
    freqs = compute_allele_frequencies(df, group_col=args.group_col)

    # Parse unacceptable antigens
    try:
        unacceptable = json.loads(args.unacc)
        # Ensure lists of ints
        for k in list(unacceptable.keys()):
            unacceptable[k] = [int(x) for x in unacceptable[k]]
    except Exception as e:
        print(f"ERROR: invalid --unacc JSON: {e}", file=sys.stderr)
        sys.exit(1)

    # Determine weights
    ethnic_weights = None
    if args.weight_by:
        ethnic_weights = build_ethnic_weights_from_counts(df, group_col=args.weight_by)
        print("[i] Using weights derived from counts in column:", args.weight_by)
        for k,v in ethnic_weights.items():
            print(f"    - {k}: {v:.4f}")
    elif args.weights:
        try:
            ethnic_weights = json.loads(args.weights)
        except Exception as e:
            print(f"ERROR: invalid --weights JSON: {e}", file=sys.stderr)
            sys.exit(1)

    # Compute CPRA
    cpra = cpra_from_unacceptable(unacceptable, freqs, ethnic_weights=ethnic_weights)

    # Report
    print("\\nCPRA result")
    print("------------")
    print(f"Unacceptable: {unacceptable}")
    print(f"CPRA (proportion): {cpra:.6f}")
    print(f"CPRA (%): {cpra*100:.2f}%")
