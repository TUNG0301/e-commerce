import React,{useState} from 'react'
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core'
import useStyles from './styles'
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';
import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

function Checkout({ cart, order, onCaptureCheckout, err }) {
    const classes = useStyles();
    const steps = ['Shipping address', 'Payment details'];
    const [shippingData, setShippingData] = useState(null);
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [isFinished, setIsFinished] = useState(false);
    const history = useHistory();

    useEffect(() => {
        if(cart.id){
          const generateToken = async () => {
            try{
                 const token = await commerce.checkout.generateToken(cart.id, { type: 'cart'})

                 setCheckoutToken(token);
            }catch(err){
                if (activeStep !== steps.length) history.push('/');
            }
          }
    
    

          generateToken();
        }
    },[cart])

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true);
        },3000)
    }


    const nextStep = () => setActiveStep((prev) => prev + 1);
    const backStep = () => setActiveStep((prev) => prev - 1); 

    const next = (data) => {
        setShippingData(data);

        nextStep();
    }
    
    
    const Form = () => (
        activeStep === 0 
        ? <AddressForm checkoutToken={checkoutToken} next={next}/> 
        : <PaymentForm backStep={backStep} nextStep={nextStep} shippingData={shippingData} checkoutToken={checkoutToken} onCaptureCheckout={onCaptureCheckout} timeout={timeout}/>
    )

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography vatiant="h6">Thank you for your purchase,{order.customer.firstname} {order.customer.lastname} </Typography>
                <Divider className={classes.divider} />
                <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button commponent={Link} to="/" variant="outlined" type="button">Back to Home</Button>

        </>
    )
        : isFinished ? (
            <>
            <div>
                <Typography vatiant="h6">Thank you for your purchase</Typography>
                <Divider className={classes.divider} />
                
            </div>
            <br />
            <Button commponent={Link} to="/" variant="outlined" type="button">Back to Home</Button>

            </>
        ) : (
            <div className={classes.spinner}>
                 <CircularProgress />
            </div>
        )
    
        if(err){
            Confirmation = () => (
             <>
              <Typography variant="h5">{err}</Typography>
              <Button component={Link} to="/" variant="outlined" type="button" >Back to Home</Button>
            </>
            )
        }

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar} />
            <main className={classes.layout} >

                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">Checkout</Typography>
                    <Stepper activeStep={activeStep} className={classes.steeper}>
                           {steps.map(step => (
                               <Step key={step}>
                                    <StepLabel>{step}</StepLabel>
                               </Step>
                           ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation/> : checkoutToken && <Form />}
                </Paper>
            </main>

           
        </>
    )
}

export default Checkout
