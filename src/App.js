import React,{ useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { commerce } from './lib/commerce'
import Products from './components/products/Products'
import NavBar from './components/navBar/NavBar'
import Cart from './components/cart/Cart'
import Checkout from './components/checkoutForm/checkout/Checkout'


function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errMessage, setErrMessage] = useState('')
    
    const fetchProducts = async () => {
        const { data } = await commerce.products.list();

        setProducts(data)
    }
    const fetchCart = async () => {
       setCart(await commerce.cart.retrieve());
    }

    const handleAddToCart = async (productId, quantity) => {
        const item = await commerce.cart.add(productId, quantity);

        setCart(item.cart);
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const {cart} = await commerce.cart.update(productId, {quantity});

        setCart(cart);
    }

    const handleRemoveFromCart = async (productId) => {
        const {cart} = await commerce.cart.remove(productId);

        setCart(cart);
    }
    const handleEmptyCart = async () =>{
        const {cart} = await commerce.cart.empty();

        setCart(cart);
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();

        setCart(newCart)
        refreshCart();
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try{
            const incomeOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

            setOrder(incomeOrder);
        }catch(err){
            setErrMessage(err.data.error.message);
        }
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    },[]);

    

    return (
        <Router>
            <NavBar totalItems={cart.total_items} />
            <Switch>
                <Route exact path="/">
                   <Products products={products} onAddToCart={handleAddToCart}/>
                </Route>
                <Route exact path="/cart">
                   <Cart cart={cart} handleUpdateCartQty={handleUpdateCartQty} handleRemoveFromCart={handleRemoveFromCart} handleEmptyCart={handleEmptyCart}/>
                </Route>
                <Route exact path="/checkout">
                    <Checkout cart={cart} order={order} onCaptureCheckout={handleCaptureCheckout} err={errMessage}/>
                </Route>
             
            </Switch>
            
        </Router>
    )
}

export default App
