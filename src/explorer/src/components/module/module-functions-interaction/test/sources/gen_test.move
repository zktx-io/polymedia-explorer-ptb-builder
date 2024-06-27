module test::gen_test
{
    public struct GenTest<T: drop> has key, store {
        id: UID,
        val: T,
    }

    public fun new_gen_test<T: drop>(
        val: T,
        ctx: &mut TxContext,
    ): GenTest<T> {
        let test = GenTest {
            id: object::new(ctx),
            val,
        };
        return test
    }

    public fun set_gen<T: drop>(
        test: &mut GenTest<T>,
        val: T,
    ) {
        test.val = val;
    }
}
