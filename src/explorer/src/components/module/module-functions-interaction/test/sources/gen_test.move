module test::gen_test
{
    use sui::event;

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


    public struct CheckTypeEvent<T> has copy, drop {
        value: T,
    }

    public fun check_type<AnyType: copy + drop>(
        value: AnyType,
    ) {
        let event = CheckTypeEvent {
            value: value,
        };
        event::emit(event)
    }

}
