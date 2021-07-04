import React from 'react'
import {Container, Typography, Button, Grid} from '@material-ui/core';
import useStyles from './styles'
import CartItem from './cartItem/CartItem';
import { Link } from 'react-router-dom';

function Cart({cart, handleEmptyCart, handleUpdateCartQty, handleRemoveFromCart }) {

    const classes = useStyles();

    const renderEmptyCart = () => (
        <Typography variant="subtitle1">You have no items in your shopping cart.
         <Link to="/" className={classes.link}>start shopping!</Link>
        
        </Typography>
    );

    if (!cart.line_items) return 'Loading...';

    const renderCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map(item => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        <CartItem item={item} handleRemoveFromCart={handleRemoveFromCart} handleUpdateCartQty={handleUpdateCartQty}/>
                    </Grid>
                ))}
            </Grid>

            <div className={classes.cartDetails}>
                <Typography variant="h4">
                    Subtotal: {cart.subtotal.formatted_with_symbol}
                </Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
                    <Button className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary" component={Link} to="/checkout">Checkout</Button>
                </div>
            </div>
        </>
    );

    return (
        <Container>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant="h3" >Your Shopping Cart</Typography>
            {!cart.line_items.length ?  renderEmptyCart()  : renderCart()}
        </Container>
    )
}

export default Cart
