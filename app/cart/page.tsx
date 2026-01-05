import CartList from "@/components/CartList";
import RequireAuth from "@/components/RequireAuth";

export default function Cart() {
    return(
        <RequireAuth>
            <CartList></CartList>
        </RequireAuth>
    );
}