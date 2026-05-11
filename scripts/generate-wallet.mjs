#!/usr/bin/env node
/**
 * Generate a test wallet for Arkiv
 * 
 * Usage: node scripts/generate-wallet.mjs
 */

import { privateKeyToAccount } from '@arkiv-network/sdk/accounts';
import { randomBytes } from 'crypto';

// Generate random private key
const privateKey = '0x' + randomBytes(32).toString('hex');
const account = privateKeyToAccount(privateKey);

console.log('\n📝 Test Wallet Generated\n');
console.log('Address:', account.address);
console.log('Private Key:', privateKey);
console.log('\n⚠️  Keep your private key secure!');
console.log('\nNext steps:');
console.log('1. Get testnet tokens from: https://braga.hoodi.arkiv.network/faucet/');
console.log('2. Add your private key to .env file:');
console.log(`   ARKIV_PRIVATE_KEY=${privateKey}`);
console.log('');
