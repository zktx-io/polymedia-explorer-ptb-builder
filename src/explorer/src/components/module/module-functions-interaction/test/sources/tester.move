module tester::tester
{
    use std::string::{String, utf8};

    public struct Tester has key, store {
        id: UID,
        bool: bool,
        u8: u8,
        u64: u64,
        str: String,
        addr: address,
        foo: Foo,
        vec_u8: vector<u8>,
        vec_u64: vector<u64>,
        vec_str: vector<String>,
        vec_foo: vector<Foo>,
    }

    public struct Foo has store, drop {
        val: u64,
    }

    public fun empty(
        ctx: &mut TxContext,
    ): Tester {
        let tester = Tester {
            id: object::new(ctx),
            bool: false,
            u8: 0,
            u64: 0,
            str: utf8(b""),
            addr: @0x1234,
            foo: Foo { val: 0 },
            vec_u8: vector::empty(),
            vec_u64: vector::empty(),
            vec_str: vector::empty(),
            vec_foo: vector::empty(),
        };
        return tester
    }

    public entry fun e_empty(
        ctx: &mut TxContext,
    ) {
        let tester = empty(ctx);
        transfer::public_transfer(tester, ctx.sender())
    }

    public fun set_bool(tester: &mut Tester, bool: bool) { tester.bool = bool; }
    public entry fun e_set_bool(tester: &mut Tester, bool: bool) { tester.set_bool(bool); }

    public fun set_u8(tester: &mut Tester, u8: u8) { tester.u8 = u8; }
    public entry fun e_set_u8(tester: &mut Tester, u8: u8) { tester.set_u8(u8); }

    public fun set_u64(tester: &mut Tester, u64: u64) { tester.u64 = u64; }
    public entry fun e_set_u64(tester: &mut Tester, u64: u64) { tester.set_u64(u64); }

    public fun set_str(tester: &mut Tester, str: vector<u8>) { tester.str = utf8(str); }
    public entry fun e_set_str(tester: &mut Tester, str: vector<u8>) { tester.set_str(str); }

    public fun set_addr(tester: &mut Tester, addr: address) { tester.addr = addr; }
    public entry fun e_set_addr(tester: &mut Tester, addr: address) { tester.set_addr(addr); }

    public fun set_foo(tester: &mut Tester, foo: Foo) { tester.foo = foo; }
    // public entry fun e_set_foo(tester: &mut Tester, foo: Foo) { tester.set_foo(foo); }

    public fun set_vec_u8(tester: &mut Tester, vec_u8: vector<u8>) { tester.vec_u8 = vec_u8; }
    public entry fun e_set_vec_u8(tester: &mut Tester, vec_u8: vector<u8>) { tester.set_vec_u8(vec_u8); }

    public fun set_vec_u64(tester: &mut Tester, vec_u64: vector<u64>) { tester.vec_u64 = vec_u64; }
    public entry fun e_set_vec_u64(tester: &mut Tester, vec_u64: vector<u64>) { tester.set_vec_u64(vec_u64); }

    public fun set_vec_str(tester: &mut Tester, vec_vec_u8: vector<vector<u8>>) {
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
    public entry fun e_set_vec_str(tester: &mut Tester, vec_vec_u8: vector<vector<u8>>) {
        tester.set_vec_str(vec_vec_u8);
    }

    public fun set_vec_foo(tester: &mut Tester, vec_foo: vector<Foo>) { tester.vec_foo = vec_foo; }
    // public entry fun e_set_vec_foo(tester: &mut Tester, vec_foo: vector<Foo>) { tester.set_vec_foo(vec_foo); }

}
