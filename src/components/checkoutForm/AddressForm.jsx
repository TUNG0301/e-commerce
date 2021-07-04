import React,{useState} from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core';
import {useForm, FormProvider} from 'react-hook-form'
import InputForm from './CustomTextField';
import { commerce } from '../../lib/commerce';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


function AddressForm({ checkoutToken, next }) {
    const [shippingCountries, setShippingCountries] = useState([])
    const [shippingCountry, setShippingCountry] = useState('');

    const [shippingSubDivision, setShippingSubDivision] = useState('');
    const [shippingSubDivisions, setShippingSubDivisions] = useState([]);

    const [shippingOptions, setShippingOptions] = useState([]);
    const [shippingOption, setShippingOption] = useState('');

    const methods = useForm();

    const fetchShippingCountries = async (checkoutTokenId) => {
        const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);

        setShippingCountries(countries);
        setShippingCountry(Object.keys(countries)[0]);
    } 

    const fetchShippingSubDivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

        setShippingSubDivisions(subdivisions);
        setShippingSubDivision(Object.keys(subdivisions)[0]);
    }

    const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region});
        
        setShippingOptions(options);
        setShippingOption(options[0].id);
    }
    


    useEffect(() => {
         fetchShippingCountries(checkoutToken.id)
    },[])

    useEffect(() => {
       if(shippingCountry) fetchShippingSubDivisions(shippingCountry)
    },[shippingCountry])

    useEffect(() => {
        if(shippingSubDivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubDivision)
    },[shippingSubDivision])
     
    const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name}))
    const subDivisions = Object.entries(shippingSubDivisions).map(([code, name]) => ({ id: code, label: name}))
    const options = shippingOptions.map(item => ({ id: item.id, label: `${item.description} - (${item.price.formatted_with_symbol})`}))
    
    

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubDivision, shippingOption}))}>
                     <Grid container spacing={3}>
                           <InputForm name="firstName" label="First Name" />
                           <InputForm name="lastName" label="Last Name" />
                           <InputForm name="address" label="Address" />
                           <InputForm name="city" label="City" />
                           <InputForm name="email" label="Email" />
                           <InputForm name="zip" label="Zip/Postal code" />
                           
                            <Grid item xs={12} sm={6}>
                                 <InputLabel>Shipping Country</InputLabel>
                                 <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                                     {
                                         countries.map(country => (
                                             <MenuItem key={country.id} value={country.id}>
                                                 {country.label}
                                             </MenuItem>
                                         ))
                                     }
                                 </Select>
                           </Grid>

                            <Grid item xs={12} sm={6}>
                                 <InputLabel>Shipping Subdivision</InputLabel>
                                 <Select value={shippingSubDivision} fullWidth onChange={(e) => setShippingSubDivision(e.target.value)}>
                                    {
                                        subDivisions.map((subDivision) => (
                                            <MenuItem key={subDivision.id} value={subDivision.id}>
                                                {subDivision.label}
                                            </MenuItem>
                                        ))
                                    }
                                 </Select>
                           </Grid>
 
                           <Grid item xs={12} sm={6}>
                                 <InputLabel>Shipping Options</InputLabel>
                                 <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                                     {
                                         options.map(option => (
                                            <MenuItem key={option.id} value={option.id}>
                                                 {option.label}
                                            </MenuItem>
                                         ))
                                     }
                                 </Select>
                             </Grid>
                           
                     </Grid>
                     <br />
                     <div style={{display: "flex", justifyContent: 'space-between'}}>
                         <Button variant="outlined" component={Link} to="/cart">Back to the Cart</Button>
                         <Button type="submit" variant="contained" color="primary"> Next </Button>
                     </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm



