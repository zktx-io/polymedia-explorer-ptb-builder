# Module Functions

This web tool lets you call functions on any Sui module, including non-entry functions. For example:

[https://explorer.polymedia.app/object/0x0…02](https://explorer.polymedia.app/object/0x0000000000000000000000000000000000000000000000000000000000000002?module=table&network=devnet)

Objects returned by the function are transferred back to the sender, when allowed by their abilities.

This document explains how to provide arguments of different types.

## Primitive types

### `u8`, `u16`, `u32`, `u64`, `u128`, `u256`

Simply enter the number: `1234`

### `address`

Simply enter the address: `0x123`. Leading zeroes are not required.

### `bool`

Enter booleans as: `true`, `false`, `1`, `0`

## Strings

Enter the string without quotes: `hello world`

Sui string arguments are typically either `0x1::string::String` or `vector<u8>`. The tool works with both:

```rust
public fun as_string(test: &mut Test, str: String) { /* ... */ }
public fun as_vector(test: &mut Test, str: vector<u8>) { /* ... */ }
```

## Vectors

Enter vector arguments as JSON arrays, for example:
- `vector<u64>` argument: `[100, 200, 300]`
- `vector<bool>` argument: `[true, false, 1, 0]`
- `vector<String>` argument: `["hello", "world"]`

Multi-dimensional vectors are also supported, for example:
- `vector<vector<String>>` argument: `[ ["a","b"], ["c","d"] ]`

## A note on `vector<u8>` arguments as strings

Entering `abc` converts to `[97, 98, 99]`, which is its UTF-8 decimal representation. It's equivalent to the `b"abc"` byte string in Move.

Meanwhile, entering `[1, 2, 3]` remains `[1, 2, 3]`.

## Options

The tool has partial support for `0x1::option::Option>` arguments. The main limitation is setting empty options (`option::none`).

Passing non-empty options (`option::some`) is straightforward. For example:
- `Option<u64>` argument: `1234`
- `Option<bool>` argument: `true`
- `Option<String>` argument: `hello world`

Passing empty options (`option::none`) is only supported in vectors of options:
- `vector<Option<u64>>` argument: `[123, null, 456]`
- `vector<Option<String>>` argument: `["hello", null, "world"]`
