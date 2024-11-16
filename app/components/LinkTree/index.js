"use client";
import React, { Suspense, useEffect, useState } from 'react';
import { Container } from './styles';
import Image from 'next/image';
import Button from '../Button/index.js';
import variables from '../../variables';
import Header from '../Header';
import { Canvas } from '@react-three/fiber';
import RainingLockersBackground from '../Three/RainingLockins';
import DiamondHandsOverlay from '../DiamondHandsOverlay';

const CA = "2kBzHjLgm9rwrbZikLk1dkx1Bt56Spc4cjdYH8Hh89Em"

function formatNumberWithSuffix(number) {
  if (number === undefined || number === null) {
    return 'N/A';
  }
  
  const num = parseFloat(number);
  if (num >= 1e15) {
    return (num / 1e15).toFixed(2) + 'M';
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'K';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + '';
  } else if (num >= 1e6) {
    return (num / 1e3).toFixed(2) + '';
  }
  return num.toFixed(2);
}

// Logos
const trading = require('../../images/trade.svg');
const bonkLogo = require('../../images/bonk.svg');
const moonLogo = require('../../images/moon.svg');
const logo = require('../../images/logo.gif');
const rayLogo = require('../../images/raydium.svg');
const dexLogo = require('../../images/dexscreener.png');


export default function LinkTree() {
  const [juppricedata, setJupPriceData] = useState();
  // const [oxtickerdata, setOxTickerData] = useState();
  // const [oxpricedata, setOxPriceData] = useState();
  const [holderdata, setHolderData] = useState();
  const [holderscan, setHolderScan] = useState();

  async function fetchData() {
    const pricedata = await fetch('/api/price', { 
      cache: 'no-store', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mint: CA })
    }).then(data => data.json());

    const heliusholderdata = await fetch('/api/heliusmarketdata', { 
      cache: 'no-store', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mint: CA })
    }).then(data => data.json());

    const holderscandata = await fetch('/api/holderscan', {
      cache: 'no-store', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mint: CA })
    }).then(data => data.json());
    
    setJupPriceData(pricedata);
    setHolderData(heliusholderdata);
    setHolderScan(holderscandata);
  }

  useEffect(() => {
    fetchData(); // Fetch initially

    const intervalId = setInterval(fetchData, 60000); // Polling every 60 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  const h = 20;
  function Loading() {
    return <h2>🌀 Loading...</h2>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Container>
        <br />
        <div className='text-center text-xl bg-slate-800 p-4 mb-4 rounded'>
          <Header picture={"./logo.gif"} title='DHANDS' subtitle={'DIAMOND FUCKING HANDS 💎'} />
          <p>Total Diamond Handlers: {holderscan?.currentHolders.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <p>Total Jeets: {holderdata?.RetardedAssJeetFaggots.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <p>Holders Over 10 USD: {holderscan?.holdersOver10USD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <br/>
          <p>MarketCap: ${holderscan?.marketCap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <br/>
          <p>Supply: {formatNumberWithSuffix(holderscan?.supply * 1000)} DHDANDS</p>
          <br />
          <p className='text-right'>Jupiter Price: ${juppricedata?.price.toFixed(6)}</p>
          <br />
          <h1 className='text-center text-4xl font-bold animate-glow 
             text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]
             [text-shadow:_0_0_10px_rgb(255_255_255_/_40%)]'>
            Diamond Hands PFP Generator
          </h1>
          <br />
          <DiamondHandsOverlay />
        </div>
       
        <br />
        
        <Button link='https://moonshot.money/xfphu3qrmzIHAq82GJ0jp3Uv?ref=vtsmoh24uf' icon={<Image src={moonLogo} height={h} alt="Moonshot" />} name='Moonshot' backgroundcolor={variables.discordColor} />
        <Button link={`https://raydium.io/swap/?inputMint=sol&outputMint=${CA}&referrer=9yA9LPCRv8p8V8ZvJVYErrVGWbwqAirotDTQ8evRxE5N`} icon={<Image src={rayLogo} height={h} alt="Raydium" />} name='Raydium' backgroundcolor={variables.discordColor} />
        <Button link={`https://dexscreener.com/solana/${CA}`} icon={<Image src={dexLogo} height={h} alt="DEXSCREENER" />} name='DEXSCREENER' backgroundcolor={variables.discordColor} />
        <Button link={`https://t.me/bonkbot_bot?start=ref_jyzn2_ca_${CA}`} icon={<Image src={bonkLogo} alt="Bonk" height={h} />} name='Bonk Buy' backgroundcolor={variables.discordColor} />
        <Button link="http://yourdiamondhands.com" 
                icon={<Image src={logo} alt="Official Site" height={h} unoptimized />} 
                name='Official Site' 
                backgroundcolor={variables.discordColor} />
        
 
      </Container>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Canvas>
          <RainingLockersBackground holders={holderdata?.totalHolders}/>
        </Canvas>
      </div>
    </Suspense>
  );
}
