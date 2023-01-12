
import * as React from 'react';
import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import makeAnimated from 'react-select/animated';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Select from 'react-select';
import Container from '@mui/material/Container';
import getSymbolFromCurrency from 'currency-symbol-map';
import styles from './index.module.css';
import TextField from '@mui/material/TextField';

const animatedComponents = makeAnimated();

const CurrencyApp = () => {
    const [options, setOptions] = useState([]);
    const [inputValue, setInputValue] = useState('')
    const [res, setRes] = useState({
        result: '',
        symbol:''
    })
    const [from, setFrom] = useState(null)
    const [to, setTo] = useState(null)

    const BASE_URL_Symbols = "https://api.apilayer.com/fixer/symbols"
    // const BASE_URL_Convert ="https://api.apilayer.com/fixer/convert?to={to}&from={from}&amount={amount}"
    const myHeaders = new Headers();
    myHeaders.append("apikey", "GGsq2V830G9ccsbvLMcT90ACLyPTYKRg");
    
    const requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: myHeaders
    };

    const fetchSymbols = async() => {
        try{
            const res = await fetch(BASE_URL_Symbols, requestOptions)
            const data = await res.json()
            return data           
        } catch(e){
            console.log(e)
        }

    }
    useEffect(()=>{
        (async()=>{
            const data = await fetchSymbols()
            const currencies = Object.keys(data.symbols).map(i=>({
                value: i,
                label: i
            }))
            setOptions(currencies)
        })()
    }, [])

    const handleChangeFrom = (options) => {
        setFrom(options)
    }
    const handleChangeTo = (options) => {
        setTo(options)
    }
    const handleInputData = (e) => {
        setInputValue(e.target.value)
    }
    const handleSwitchCurrencies = () =>{
        setFrom(to)
        setTo(from)
    }
    const handleConvertButton = async() => {
        try{
            const res = await fetch(`https://api.apilayer.com/fixer/convert?to=${to.value}&from=${from.value}&amount=${inputValue}`, requestOptions)
            const data = await res.json()
            setRes({
                result: Math.round(data.result),
                symbol:getSymbolFromCurrency(`${to.value}`)
            })
        } catch(e){
            console.log(e)
        }
    }
    return (
        <div>
            <Card 
            sx={{ maxWidth: 600, m:'0 auto'}} 
            className={styles.wrap} 
            variant="outlined"
            >
                <Typography 
                sx={{ mb: 3 }} 
                color="text.primary"
                >
                    Simple Currency Converter
                </Typography>
                <Card 
                sx={{ maxWidth: 450, m:'0 auto', borderTop:"4px solid #7ee3e7 ",overflow:'unset' }} 
                variant="outlined"
                >
                    <CardContent>
                        <Typography 
                        sx={{ mb: 1.5 }} 
                        color="text.secondary"
                        >
                            Exchange Rate
                        </Typography>
                        <Typography 
                        sx={{ mb: 1.5 }} 
                        color="text.primary"
                        variant="h3"
                        >
                            {`${res.result} ${res.symbol}`}
                        </Typography>
                        <TextField
                            type='number'
                            id="outlined-number"
                            label="Amount"
                            variant="filled"
                            value={inputValue}
                            sx={{ width:340, mb: 2.5}}
                            onChange={handleInputData}
                            />
                        <Container 
                        className={styles.container} 
                        sx={{display:'flex'}}
                        >
                        <div className={styles.select_block}>
                            <span>From</span>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={options}
                                onChange={handleChangeFrom}
                                value={from}
                                />
                        </div>
                        <IconButton 
                        aria-label="switch"
                        onClick={handleSwitchCurrencies} >
                            <CompareArrowsIcon/> 
                        </IconButton>
                        <div className={styles.select_block}>
                            <span>To</span>
                            <Select
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                options={options}
                                onChange={handleChangeTo}
                                value={to}
                            />
                        </div> 
                        </Container>
                    </CardContent>
                    <CardActions sx={{ justifyContent:'center', m:1.5}}>
                        <Button 
                        variant="contained" 
                        sx={{ width:300, backgroundColor:'#7ee3e7'}}
                        onClick={handleConvertButton}
                        >
                        Convert
                        </Button>
                    </CardActions>
                    </Card>
                </Card>
        </div>
    );
};

export default CurrencyApp;