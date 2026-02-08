import { describe, expect, it } from "bun:test";

import { StockAmount } from "#Application/ValueObjects/StockAmount.ts";
import { StockAvailabilityStatus } from "#Application/ValueObjects/StockAvailabilityStatus.ts";

import { Stock } from "./Stock.ts";

describe("Stock Entity", () => {
  it("should create stock with amount and availability", () => {
    const amount = StockAmount.parse(10);
    const availability = StockAvailabilityStatus.green;

    const stock = Stock.create(amount, availability);

    expect(stock.amount).toBe(amount);
    expect(stock.availability).toBe(availability);
  });

  it("should add stock successfully", () => {
    const initialAmount = StockAmount.parse(5);
    const stock = Stock.create(initialAmount, StockAvailabilityStatus.green);

    const addAmount = StockAmount.parse(3);
    stock.addStock(addAmount);

    expect(stock.amount.value).toBe(8);
    expect(stock.availability).toBe(StockAvailabilityStatus.yellow);
  });

  it("should subtract stock successfully", () => {
    const initialAmount = StockAmount.parse(10);
    const stock = Stock.create(initialAmount, StockAvailabilityStatus.green);

    const subtractAmount = StockAmount.parse(4);
    stock.subtractStock(subtractAmount);

    expect(stock.amount.value).toBe(6);
    expect(stock.availability).toBe(StockAvailabilityStatus.yellow);
  });

  it("should set availability to yellow when amount is low", () => {
    const initialAmount = StockAmount.parse(60);
    const stock = Stock.create(initialAmount, StockAvailabilityStatus.red);

    const subtractAmount = StockAmount.parse(15);
    stock.subtractStock(subtractAmount);

    expect(stock.amount.value).toBe(45);
    expect(stock.availability).toBe(StockAvailabilityStatus.yellow);
  });

  it("should set availability to yellow when amount is zero", () => {
    const initialAmount = StockAmount.parse(60);
    const stock = Stock.create(initialAmount, StockAvailabilityStatus.red);

    const subtractAmount = StockAmount.parse(60);
    stock.subtractStock(subtractAmount);

    expect(stock.amount.value).toBe(0);
    expect(stock.availability).toBe(StockAvailabilityStatus.yellow);
  });

  it("should throw when trying to subtract more stock than available", () => {
    const initialAmount = StockAmount.parse(5);
    const stock = Stock.create(initialAmount, StockAvailabilityStatus.green);

    const subtractAmount = StockAmount.parse(10);

    expect(() => stock.subtractStock(subtractAmount)).toThrow("Out of Stock");
  });

  it("should update availability to green when adding stock reaches 100", () => {
    const initialAmount = StockAmount.parse(60);
    const stock = Stock.create(initialAmount, StockAvailabilityStatus.red);

    const addAmount = StockAmount.parse(40);
    stock.addStock(addAmount);

    expect(stock.amount.value).toBe(100);
    expect(stock.availability).toBe(StockAvailabilityStatus.green);
  });

  it("should keep availability at yellow when adding stock to small amount", () => {
    const initialAmount = StockAmount.parse(30);
    const stock = Stock.create(initialAmount, StockAvailabilityStatus.yellow);

    const addAmount = StockAmount.parse(10);
    stock.addStock(addAmount);

    expect(stock.amount.value).toBe(40);
    expect(stock.availability).toBe(StockAvailabilityStatus.yellow);
  });
});

