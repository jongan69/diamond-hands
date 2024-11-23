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

function getLargerNumber(num1, num2) {
  if (num1 === undefined || num1 === null) {
    return num2;
  }
  if (num2 === undefined || num2 === null) {
    return num1;
  }
  return num1 > num2 ? num1 : num2;
}

// Logos
// const trading = require('../../images/trade.svg');
const bonkLogo = require('../../images/bonk.svg');
const moonLogo = require('../../images/moon.svg');
const logo = require('../../images/logo.gif');
const rayLogo = require('../../images/raydium.svg');
const dexLogo = require('../../images/dexscreener.png');
const bagsLogo = require('../../images/bags.jpg');
const twitterLogo = require('../../images/twitter.svg');
const coinGeckoLogo = require('../../images/coingecko.svg');
const rugcheckLogo = require('../../images/rugcheck.jpg');

export default function LinkTree() {
  const [juppricedata, setJupPriceData] = useState();
  // const [oxtickerdata, setOxTickerData] = useState();
  // const [oxpricedata, setOxPriceData] = useState();
  const [holderdata, setHolderData] = useState();
  const [holderscan, setHolderScan] = useState();
  const [isCopied, setIsCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CA).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <Suspense fallback={<Loading />}>
      <Container>
        <br />
        <div className='text-center text-xl bg-slate-800 p-4 mb-4 rounded'>
          <Header picture={"./logo.gif"} title='DHANDS' subtitle={'DIAMOND FUCKING HANDS 💎'} />
          <br />
          <section className='bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-lg shadow-lg mb-4'>
            <h2 className='text-2xl font-bold text-white'>Why Diamond Hands?</h2>
            <p className='text-white mt-2'>
              Diamond hands represent the strength and resilience of holding onto valuable assets despite market volatility.
              It&apos;s about long-term vision and unwavering belief in the potential of your investments.
            </p>
          </section>

          <p>Total Diamond Handlers: {getLargerNumber(holderscan?.currentHolder, holderdata?.totalHolders)}</p>
          {holderdata?.RetardedAssJeetFaggots && <p>Total Paper Hands: {holderdata?.RetardedAssJeetFaggots?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
          {holderscan?.holdersOver10USD && <p>Holders Over 10 USD: {holderscan?.holdersOver10USD?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
          <br />
          {holderscan?.marketCap && <p>MarketCap: ${holderscan?.marketCap?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
          <br />
          {holderscan?.supply && <p>Supply: {formatNumberWithSuffix(holderscan?.supply * 1000)} DHDANDS</p>}
          <br />
          {juppricedata?.price && <p className='text-center'>Jupiter Price: ${juppricedata?.price?.toFixed(6)}</p>}
          <br />

          {/* New CA Display and Copy Button */}
          <div className='flex justify-center items-center mb-4'>
            <p className='mr-2'>CA: {CA.slice(0, 4)}...{CA.slice(-4)}</p>
            <button 
              onClick={copyToClipboard} 
              className={`p-2 bg-blue-500 text-white rounded ${isCopied ? 'animate-bounce' : ''}`}
            >
              {isCopied ? 'Copied!' : 'Copy CA'}
            </button>
          </div>

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
        <Button link={`https://bags.fm/b/$DHANDS`} icon={<Image src={bagsLogo} height={h} alt="Bags" />} name='Bags' backgroundcolor={variables.whatsappColor} />
        <Button link={`https://rugcheck.xyz/tokens/${CA}`} icon={<Image src={rugcheckLogo} height={h} alt="Rugcheck" />} name='Rugcheck' backgroundcolor={variables.whatsappColor} />
        <Button link={`https://x.com/i/communities/1855723540701753377`} icon={<Image src={twitterLogo} height={h} alt="Twitter" />} name='Twitter' backgroundcolor={variables.discordColor} />
        <Button link={`https://dexscreener.com/solana/${CA}`} icon={<Image src={dexLogo} height={h} alt="DEXSCREENER" />} name='DEXSCREENER' backgroundcolor={variables.discordColor} />
        <Button link={`https://www.coingecko.com/en/coins/diamond-hands-2`} icon={<Image src={coinGeckoLogo} height={h} alt="CoinGecko" />} name='' backgroundcolor={variables.whatsappColor} />
        <Button link={`https://t.me/bonkbot_bot?start=ref_jyzn2_ca_${CA}`} icon={<Image src={bonkLogo} alt="Bonk" height={h} />} name='Bonk Buy' backgroundcolor={variables.discordColor} />
        <Button link="http://yourdiamondhands.com"
          icon={<Image src={logo} alt="OG Site" height={h} unoptimized />}
          name='OG Site'
          backgroundcolor={variables.discordColor} />


      </Container>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <Canvas>
          <RainingLockersBackground holders={holderdata?.totalHolders} />
        </Canvas>
      </div>
    </Suspense>
  );
}
