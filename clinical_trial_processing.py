"""Utilities for processing clinical trial patient records."""

from __future__ import annotations

from collections import Counter, defaultdict
from collections.abc import Iterator
from math import isfinite
from statistics import mean, median
from typing import Any, Iterable, Mapping


def _is_blank(value: Any) -> bool:
    return value is None or (isinstance(value, str) and not value.strip())


def _parse_group(value: Any) -> str | None:
    if value is None:
        return None
    group = str(value).strip()
    return group or None


def _parse_age(value: Any) -> float | None:
    if _is_blank(value) or isinstance(value, bool):
        return None
    try:
        age = float(value)
    except (TypeError, ValueError):
        return None
    if not isfinite(age) or age < 0 or age > 120:
        return None
    return age


def _parse_outcome(value: Any) -> tuple[str, float | str | None]:
    """Return outcome kind and parsed value.

    Kinds:
    - "missing": missing or blank
    - "numeric": parsed float value
    - "categorical": normalized string category
    """

    if _is_blank(value):
        return "missing", None
    if isinstance(value, str):
        normalized = value.strip()
        try:
            numeric_value = float(normalized)
            if not isfinite(numeric_value):
                return "missing", None
            return "numeric", numeric_value
        except ValueError:
            return "categorical", normalized
    if isinstance(value, bool):
        return "categorical", str(value)
    if isinstance(value, (int, float)):
        numeric_value = float(value)
        if not isfinite(numeric_value):
            return "missing", None
        return "numeric", numeric_value
    normalized = str(value).strip()
    return ("categorical", normalized) if normalized else ("missing", None)


def _new_group_bucket() -> dict[str, Any]:
    return {
        "total_patients": 0,
        "missing_age_count": 0,
        "invalid_age_count": 0,
        "ages": [],
        "missing_outcome_count": 0,
        "numeric_outcomes": [],
        "categorical_outcomes": Counter(),
    }


def _prepare_record_iterator(
    patient_records: Iterable[Mapping[str, Any]] | Mapping[str, Any] | Any,
    excluded_records: list[dict[str, Any]],
) -> Iterator[Any]:
    if patient_records is None:
        excluded_records.append(
            {
                "index": None,
                "reason": "patient_records is None",
                "record": None,
            }
        )
        return iter(())

    if isinstance(patient_records, Mapping):
        # Allow callers to provide a single record mapping by mistake.
        return iter([patient_records])

    if isinstance(patient_records, (str, bytes)):
        excluded_records.append(
            {
                "index": None,
                "reason": "patient_records must be an iterable of mappings",
                "record": patient_records,
            }
        )
        return iter(())

    try:
        return iter(patient_records)
    except TypeError:
        excluded_records.append(
            {
                "index": None,
                "reason": "patient_records is not iterable",
                "record": patient_records,
            }
        )
        return iter(())


def _update_age_summary(summary: dict[str, Any], raw_age: Any) -> None:
    age = _parse_age(raw_age)
    if _is_blank(raw_age):
        summary["missing_age_count"] += 1
    elif age is None:
        summary["invalid_age_count"] += 1
    else:
        summary["ages"].append(age)


def _update_outcome_summary(summary: dict[str, Any], raw_outcome: Any) -> None:
    outcome_kind, parsed_outcome = _parse_outcome(raw_outcome)
    if outcome_kind == "missing":
        summary["missing_outcome_count"] += 1
    elif outcome_kind == "numeric":
        summary["numeric_outcomes"].append(parsed_outcome)
    else:
        summary["categorical_outcomes"][parsed_outcome] += 1


def _build_group_summary(stats: dict[str, Any]) -> dict[str, Any]:
    ages = stats["ages"]
    numeric_outcomes = stats["numeric_outcomes"]
    categorical_outcomes = dict(stats["categorical_outcomes"])

    if numeric_outcomes and categorical_outcomes:
        outcome_type = "mixed"
    elif numeric_outcomes:
        outcome_type = "numeric"
    elif categorical_outcomes:
        outcome_type = "categorical"
    else:
        outcome_type = "none"

    return {
        "total_patients": stats["total_patients"],
        "missing_age_count": stats["missing_age_count"],
        "invalid_age_count": stats["invalid_age_count"],
        "age_stats": {
            "count": len(ages),
            "mean": round(mean(ages), 3) if ages else None,
            "min": min(ages) if ages else None,
            "max": max(ages) if ages else None,
        },
        "outcome_stats": {
            "type": outcome_type,
            "missing_count": stats["missing_outcome_count"],
            "numeric": {
                "count": len(numeric_outcomes),
                "mean": round(mean(numeric_outcomes), 3) if numeric_outcomes else None,
                "median": round(median(numeric_outcomes), 3)
                if numeric_outcomes
                else None,
                "min": min(numeric_outcomes) if numeric_outcomes else None,
                "max": max(numeric_outcomes) if numeric_outcomes else None,
            },
            "categorical_counts": categorical_outcomes,
        },
    }


def process_clinical_trial_data(
    patient_records: Iterable[Mapping[str, Any]],
) -> dict[str, Any]:
    """Process patient records and produce grouped summary statistics.

    Each record is expected to include:
    - age
    - treatment group (``treatment_group`` or ``group``)
    - outcome

    Records missing a treatment group or with non-mapping structure are
    excluded and reported in ``excluded_records``. Missing or invalid ages and
    outcomes are handled without failing processing.
    """

    grouped: dict[str, dict[str, Any]] = defaultdict(_new_group_bucket)
    excluded_records: list[dict[str, Any]] = []
    input_count = 0
    processed_count = 0
    record_iterator = _prepare_record_iterator(patient_records, excluded_records)

    for idx, record in enumerate(record_iterator):
        input_count += 1
        if not isinstance(record, Mapping):
            excluded_records.append(
                {"index": idx, "reason": "record is not a mapping", "record": record}
            )
            continue

        group = _parse_group(record.get("treatment_group", record.get("group")))
        if group is None:
            excluded_records.append(
                {
                    "index": idx,
                    "reason": "missing treatment group",
                    "record": dict(record),
                }
            )
            continue

        summary = grouped[group]
        summary["total_patients"] += 1
        processed_count += 1

        _update_age_summary(summary, record.get("age"))
        _update_outcome_summary(summary, record.get("outcome"))

    group_summary: dict[str, dict[str, Any]] = {
        group: _build_group_summary(stats) for group, stats in grouped.items()
    }

    return {
        "group_summary": group_summary,
        "excluded_records": excluded_records,
        "overall": {
            "input_records": input_count,
            "processed_records": processed_count,
            "excluded_records": len(excluded_records),
        },
    }
