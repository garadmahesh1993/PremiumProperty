import { test } from "node:test";
import assert from "node:assert/strict";
import { demoListings } from "../lib/demo-data.ts";
import {
  emptyFilters,
  filterParams,
  filterProperties,
  modeDefaults,
  parseFilters,
} from "../lib/social/search.ts";
test("existing location and BHK links return actual catalogue entries", () => {
  assert.deepEqual(
    filterProperties(demoListings, {
      ...emptyFilters,
      purpose: "buy",
      city: "  PUNE ",
      bhk: "3",
    }).map((item) => item.id),
    ["pp-101", "pp-104"],
  );
});
test("price and area ranges are inclusive", () => {
  assert.deepEqual(
    filterProperties(demoListings, {
      ...emptyFilters,
      purpose: "buy",
      min: "14800000",
      max: "18200000",
      minArea: "1460",
      maxArea: "1585",
    }).map((item) => item.id),
    ["pp-101", "pp-104"],
  );
});
test("legacy subtype, bedroom minimum and furnishing links remain supported", () => {
  assert.equal(filterProperties(demoListings, { ...emptyFilters, bed: "4" }).length, 2);
  assert.deepEqual(
    filterProperties(demoListings, { ...emptyFilters, kind: "villa", purpose: "rent" }).map(
      (item) => item.id,
    ),
    ["pp-103"],
  );
  assert.equal(
    filterProperties(demoListings, { ...emptyFilters, purpose: "rent", furn: "Fully furnished" })
      .length,
    2,
  );
});
test("unavailable inventory produces an empty result", () => {
  assert.equal(
    filterProperties(demoListings, { ...emptyFilters, city: "No such sample city" }).length,
    0,
  );
});
test("price sorting never interleaves monthly rents with sale totals", () => {
  const result = filterProperties(demoListings, { ...emptyFilters, sort: "price-low" });
  const firstRental = result.findIndex((item) => item.purpose === "rent");
  assert.ok(firstRental > 0);
  assert.ok(result.slice(0, firstRental).every((item) => item.purpose === "buy"));
  for (const purpose of ["buy", "rent"]) {
    const prices = result.filter((item) => item.purpose === purpose).map((item) => item.price);
    assert.deepEqual(
      prices,
      [...prices].sort((a, b) => a - b),
    );
  }
});
test("area and descending price sorts do not mutate inventory", () => {
  const original = demoListings.map((item) => item.id);
  assert.equal(filterProperties(demoListings, { ...emptyFilters, sort: "area" })[0].id, "pp-109");
  assert.equal(
    filterProperties(demoListings, { ...emptyFilters, purpose: "buy", sort: "price-high" })[0].id,
    "pp-102",
  );
  assert.deepEqual(
    demoListings.map((item) => item.id),
    original,
  );
});
test("URL round-trip preserves explicit removal of category-route defaults", () => {
  const defaults = modeDefaults("buy");
  assert.deepEqual(parseFilters(filterParams(emptyFilters, defaults), defaults), emptyFilters);
  const selected = {
    ...emptyFilters,
    city: "Pune",
    q: "Baner",
    max: "20000000",
    verified: "true",
    sort: "area",
  };
  assert.deepEqual(parseFilters(filterParams(selected)), selected);
});
test("malformed parameters and unsupported newest sorting are sanitized", () => {
  assert.deepEqual(
    parseFilters(
      new URLSearchParams(
        "purpose=invalid&category=invalid&max=NaN&min=-2&minArea=Infinity&verified=false&sort=newest",
      ),
    ),
    emptyFilters,
  );
});
