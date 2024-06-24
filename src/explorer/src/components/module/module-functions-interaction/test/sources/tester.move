module tester::tester
{
    // === Imports ===

    use std::string::{String, utf8};

    // === Structs ===

    public struct Tester has key, store {
        id: UID,

        bool: bool,
        u8: u8,
        u16: u16,
        addr: address,
        str: String,
        foo: Foo,
        opt_u8: Option<u8>,
        opt_u16: Option<u16>,

        vec_bool: vector<bool>,
        vec_u8: vector<u8>,
        vec_u16: vector<u16>,
        vec_vec_u16: vector<vector<u16>>,
        vec_addr: vector<address>,
        vec_str: vector<String>,
        vec_foo: vector<Foo>,
        vec_opt_u8: vector<Option<u8>>,
        vec_opt_u16: vector<Option<u16>>,
    }

    public struct Foo has key, store {
        id: UID,
        val: u64,
    }

    // === Constructors ===

    public fun new_tester(
        ctx: &mut TxContext,
    ): Tester {
        let tester = Tester {
            id: object::new(ctx),

            bool: false,
            u8: 0,
            u16: 0,
            addr: @0x1234,
            str: utf8(b""),
            foo: Foo { id: object::new(ctx), val: 0 },
            opt_u8: option::none(),
            opt_u16: option::none(),

            vec_bool: vector::empty(),
            vec_u8: vector::empty(),
            vec_u16: vector::empty(),
            vec_vec_u16: vector::empty(),
            vec_addr: vector::empty(),
            vec_str: vector::empty(),
            vec_foo: vector::empty(),
            vec_opt_u8: vector::empty(),
            vec_opt_u16: vector::empty(),
        };
        return tester
    }

    public entry fun e_new_tester(
        ctx: &mut TxContext,
    ) {
        let tester = new_tester(ctx);
        transfer::public_transfer(tester, ctx.sender())
    }

    public fun two_new_testers(
        ctx: &mut TxContext,
    ): (Tester, Tester) {
        return (new_tester(ctx), new_tester(ctx))
    }

    // === Destructors ===

    public fun destroy_tester(
        tester: Tester,
    ) {
        let Tester {
            id,
            bool: _,
            u8: _,
            u16: _,
            addr: _,
            str: _,
            foo,
            opt_u8: _,
            opt_u16: _,
            vec_bool: _,
            vec_u8: _,
            vec_u16: _,
            vec_vec_u16: _,
            vec_addr: _,
            vec_str: _,
            mut vec_foo,
            vec_opt_u8: _,
            vec_opt_u16: _,
        } = tester;

        id.delete();
        foo.destroy_foo();

        while ( vec_foo.length() > 0 ) {
            let foo = vec_foo.pop_back();
            foo.destroy_foo();
        };
        vec_foo.destroy_empty();
    }

    public fun destroy_foo(
        foo: Foo,
    ) {
        let Foo { id, val: _ } = foo;
        id.delete();
    }

    // === Setters: single-value ===

    public fun set_bool(tester: &mut Tester, bool: bool) { tester.bool = bool; }

    public fun set_u8(tester: &mut Tester, u8: u8) { tester.u8 = u8; }

    public fun set_u16(tester: &mut Tester, u16: u16) { tester.u16 = u16; }

    public fun set_addr(tester: &mut Tester, addr: address) { tester.addr = addr; }

    public fun set_str_as_str(tester: &mut Tester, str: String) { tester.str = str; }
    public fun set_str_as_vec_u8(tester: &mut Tester, str: vector<u8>) { tester.str = utf8(str); }

    public fun set_opt_u8(tester: &mut Tester, opt_u8: Option<u8>) { tester.opt_u8 = opt_u8; }

    public fun set_opt_u16(tester: &mut Tester, opt_u16: Option<u16>) { tester.opt_u16 = opt_u16; }

    // public fun set_foo(tester: &mut Tester, foo: Foo) { tester.foo = foo; }

    // === Setters: vectors ===

    public fun set_vec_bool(tester: &mut Tester, vec_bool: vector<bool>) { tester.vec_bool = vec_bool; }

    public fun set_vec_u8(tester: &mut Tester, vec_u8: vector<u8>) { tester.vec_u8 = vec_u8; }

    public fun set_vec_u16(tester: &mut Tester, vec_u16: vector<u16>) { tester.vec_u16 = vec_u16; }

    public fun set_vec_vec_u16(tester: &mut Tester, vec_vec_u16: vector<vector<u16>>) { tester.vec_vec_u16 = vec_vec_u16; }

    public fun set_vec_addr(tester: &mut Tester, vec_addr: vector<address>) { tester.vec_addr = vec_addr; }

    public fun set_vec_str_as_vec_str(tester: &mut Tester, vec_str: vector<String>) { tester.vec_str = vec_str; }
    public fun set_vec_str_as_vec_vec_u8(tester: &mut Tester, vec_vec_u8: vector<vector<u8>>) {
        let len = vec_vec_u8.length();
        let mut i = 0;
        let mut vec_str = vector::empty<String>();
        while ( i < len ) {
            i = i + 1;
            let raw = vec_vec_u8.borrow(i);
            let str = utf8(*raw);
            vec_str.push_back(str);
        };
        tester.vec_str = vec_str;
    }

    public fun set_vec_opt_u8(tester: &mut Tester, vec_opt_u8: vector<Option<u8>>) { tester.vec_opt_u8 = vec_opt_u8; }

    public fun set_vec_opt_u16(tester: &mut Tester, vec_opt_u16: vector<Option<u16>>) { tester.vec_opt_u16 = vec_opt_u16; }

    // public fun set_vec_foo(tester: &mut Tester, vec_foo: vector<Foo>) { tester.vec_foo = vec_foo; }

    // === Functions that return values ===

    public fun double_u8(num: u8): u8 {
        return num * 2
    }

    public fun get_u8_and_foo(ctx: &mut TxContext): (u8, Foo) {
        return (123, Foo { id: object::new(ctx), val: 33 })
    }

    public fun sum_three_u8(a: u8, b: u8, c: u8): u8 {
        return a + b + c
    }

}
