import { useState, useMemo } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LineChart, Line } from "recharts";

// ── SAMPLE DATA (3-month statements: Feb–Apr 2025) ────────────────────────────
const SAMPLE_CHECKING = [{"date":"2025-02-01","description":"DIRECT DEPOSIT - ACME CORP PAYROLL","amount":2850.0,"category":"INCOME"},{"date":"2025-02-01","description":"ZELLE - RIVERSIDE APTS RENT","amount":-1450.0,"category":"RENT_MORTGAGE"},{"date":"2025-02-01","description":"WHOLE FOODS MARKET","amount":-115.9,"category":"GROCERIES"},{"date":"2025-02-02","description":"TRANSFER TO SAVINGS","amount":-300.0,"category":"TRANSFER"},{"date":"2025-02-07","description":"ATM WITHDRAWAL","amount":-100.0,"category":"DISCRETIONARY"},{"date":"2025-02-08","description":"WEGMANS","amount":-57.86,"category":"GROCERIES"},{"date":"2025-02-08","description":"EXXON MOBIL #4821","amount":-69.03,"category":"TRANSPORT"},{"date":"2025-02-10","description":"CON EDISON ELECTRIC","amount":-105.26,"category":"UTILITIES"},{"date":"2025-02-12","description":"VERIZON WIRELESS","amount":-89.0,"category":"UTILITIES"},{"date":"2025-02-12","description":"TRADER JOE'S","amount":-100.48,"category":"GROCERIES"},{"date":"2025-02-15","description":"DIRECT DEPOSIT - ACME CORP PAYROLL","amount":2850.0,"category":"INCOME"},{"date":"2025-02-15","description":"TRADER JOE'S","amount":-119.44,"category":"GROCERIES"},{"date":"2025-02-18","description":"CITI CARD PAYMENT","amount":-583.74,"category":"OTHER_FIXED"},{"date":"2025-02-19","description":"WEGMANS","amount":-74.84,"category":"GROCERIES"},{"date":"2025-02-21","description":"ATM WITHDRAWAL","amount":-80.0,"category":"DISCRETIONARY"},{"date":"2025-02-22","description":"WHOLE FOODS MARKET","amount":-123.29,"category":"GROCERIES"},{"date":"2025-02-22","description":"SHELL #7234","amount":-55.55,"category":"TRANSPORT"},{"date":"2025-02-26","description":"WEGMANS","amount":-85.62,"category":"GROCERIES"},{"date":"2025-03-01","description":"DIRECT DEPOSIT - ACME CORP PAYROLL","amount":2850.0,"category":"INCOME"},{"date":"2025-03-01","description":"ZELLE - RIVERSIDE APTS RENT","amount":-1450.0,"category":"RENT_MORTGAGE"},{"date":"2025-03-01","description":"STOP & SHOP","amount":-64.2,"category":"GROCERIES"},{"date":"2025-03-02","description":"TRANSFER TO SAVINGS","amount":-300.0,"category":"TRANSFER"},{"date":"2025-03-05","description":"STOP & SHOP","amount":-131.27,"category":"GROCERIES"},{"date":"2025-03-07","description":"ATM WITHDRAWAL","amount":-100.0,"category":"DISCRETIONARY"},{"date":"2025-03-08","description":"WHOLE FOODS MARKET","amount":-120.68,"category":"GROCERIES"},{"date":"2025-03-08","description":"EXXON MOBIL #4821","amount":-63.73,"category":"TRANSPORT"},{"date":"2025-03-10","description":"CON EDISON ELECTRIC","amount":-88.68,"category":"UTILITIES"},{"date":"2025-03-12","description":"VERIZON WIRELESS","amount":-89.0,"category":"UTILITIES"},{"date":"2025-03-12","description":"WEGMANS","amount":-62.09,"category":"GROCERIES"},{"date":"2025-03-15","description":"DIRECT DEPOSIT - ACME CORP PAYROLL","amount":2850.0,"category":"INCOME"},{"date":"2025-03-15","description":"STOP & SHOP","amount":-106.96,"category":"GROCERIES"},{"date":"2025-03-18","description":"CITI CARD PAYMENT","amount":-470.55,"category":"OTHER_FIXED"},{"date":"2025-03-19","description":"WHOLE FOODS MARKET","amount":-114.51,"category":"GROCERIES"},{"date":"2025-03-21","description":"ATM WITHDRAWAL","amount":-80.0,"category":"DISCRETIONARY"},{"date":"2025-03-22","description":"WHOLE FOODS MARKET","amount":-131.98,"category":"GROCERIES"},{"date":"2025-03-22","description":"SHELL #7234","amount":-57.5,"category":"TRANSPORT"},{"date":"2025-03-29","description":"WEGMANS","amount":-112.21,"category":"GROCERIES"},{"date":"2025-04-01","description":"DIRECT DEPOSIT - ACME CORP PAYROLL","amount":2850.0,"category":"INCOME"},{"date":"2025-04-01","description":"ZELLE - RIVERSIDE APTS RENT","amount":-1450.0,"category":"RENT_MORTGAGE"},{"date":"2025-04-02","description":"STOP & SHOP","amount":-86.97,"category":"GROCERIES"},{"date":"2025-04-02","description":"TRANSFER TO SAVINGS","amount":-300.0,"category":"TRANSFER"},{"date":"2025-04-05","description":"WHOLE FOODS MARKET","amount":-109.82,"category":"GROCERIES"},{"date":"2025-04-07","description":"ATM WITHDRAWAL","amount":-100.0,"category":"DISCRETIONARY"},{"date":"2025-04-08","description":"EXXON MOBIL #4821","amount":-69.95,"category":"TRANSPORT"},{"date":"2025-04-09","description":"TRADER JOE'S","amount":-69.71,"category":"GROCERIES"},{"date":"2025-04-10","description":"CON EDISON ELECTRIC","amount":-95.43,"category":"UTILITIES"},{"date":"2025-04-12","description":"VERIZON WIRELESS","amount":-89.0,"category":"UTILITIES"},{"date":"2025-04-12","description":"TRADER JOE'S","amount":-116.62,"category":"GROCERIES"},{"date":"2025-04-15","description":"DIRECT DEPOSIT - ACME CORP PAYROLL","amount":2850.0,"category":"INCOME"},{"date":"2025-04-18","description":"CITI CARD PAYMENT","amount":-601.05,"category":"OTHER_FIXED"},{"date":"2025-04-19","description":"TRADER JOE'S","amount":-128.96,"category":"GROCERIES"},{"date":"2025-04-21","description":"ATM WITHDRAWAL","amount":-80.0,"category":"DISCRETIONARY"},{"date":"2025-04-22","description":"SHELL #7234","amount":-59.01,"category":"TRANSPORT"},{"date":"2025-04-26","description":"WHOLE FOODS MARKET","amount":-73.99,"category":"GROCERIES"}];
const SAMPLE_SAVINGS  = [{"date":"2025-02-02","description":"TRANSFER FROM CHECKING","amount":300.0,"category":"TRANSFER"},{"date":"2025-02-28","description":"INTEREST PAYMENT","amount":4.95,"category":"INCOME"},{"date":"2025-03-02","description":"TRANSFER FROM CHECKING","amount":300.0,"category":"TRANSFER"},{"date":"2025-03-28","description":"INTEREST PAYMENT","amount":4.92,"category":"INCOME"},{"date":"2025-04-02","description":"TRANSFER FROM CHECKING","amount":300.0,"category":"TRANSFER"},{"date":"2025-04-28","description":"INTEREST PAYMENT","amount":5.45,"category":"INCOME"}];
const SAMPLE_CREDIT   = [{"date":"2025-02-01","description":"PANERA BREAD","amount":-34.28,"category":"DINING"},{"date":"2025-02-02","description":"DUNKIN","amount":-21.94,"category":"DINING"},{"date":"2025-02-03","description":"NETFLIX","amount":-15.49,"category":"SUBSCRIPTIONS"},{"date":"2025-02-03","description":"MCDONALDS","amount":-38.12,"category":"DINING"},{"date":"2025-02-03","description":"CHIPOTLE MEXICAN GRILL","amount":-59.81,"category":"DINING"},{"date":"2025-02-03","description":"SHAKE SHACK","amount":-46.02,"category":"DINING"},{"date":"2025-02-04","description":"SPOTIFY","amount":-10.99,"category":"SUBSCRIPTIONS"},{"date":"2025-02-04","description":"THAI ORCHID RESTAURANT","amount":-44.19,"category":"DINING"},{"date":"2025-02-04","description":"THAI ORCHID RESTAURANT","amount":-31.52,"category":"DINING"},{"date":"2025-02-05","description":"AMAZON PRIME","amount":-14.99,"category":"SUBSCRIPTIONS"},{"date":"2025-02-05","description":"MCDONALDS","amount":-23.83,"category":"DINING"},{"date":"2025-02-05","description":"MCDONALDS","amount":-59.79,"category":"DINING"},{"date":"2025-02-05","description":"CHIPOTLE MEXICAN GRILL","amount":-49.14,"category":"DINING"},{"date":"2025-02-05","description":"TICKETMASTER","amount":-77.14,"category":"DISCRETIONARY"},{"date":"2025-02-06","description":"CHATGPT PLUS","amount":-20.0,"category":"SUBSCRIPTIONS"},{"date":"2025-02-06","description":"H&M","amount":-53.8,"category":"DISCRETIONARY"},{"date":"2025-02-07","description":"GYM - PLANET FITNESS","amount":-24.99,"category":"SUBSCRIPTIONS"},{"date":"2025-02-07","description":"STARBUCKS","amount":-54.35,"category":"DINING"},{"date":"2025-02-07","description":"DUNKIN","amount":-15.58,"category":"DINING"},{"date":"2025-02-08","description":"HULU","amount":-17.99,"category":"SUBSCRIPTIONS"},{"date":"2025-02-08","description":"SUSHI PALACE","amount":-9.19,"category":"DINING"},{"date":"2025-02-09","description":"FIVE GUYS","amount":-24.54,"category":"DINING"},{"date":"2025-02-09","description":"MCDONALDS","amount":-53.96,"category":"DINING"},{"date":"2025-02-10","description":"SWEETGREEN","amount":-60.36,"category":"DINING"},{"date":"2025-02-11","description":"BLUE BOTTLE COFFEE","amount":-38.95,"category":"DINING"},{"date":"2025-02-13","description":"SHAKE SHACK","amount":-40.82,"category":"DINING"},{"date":"2025-02-14","description":"MCDONALDS","amount":-63.19,"category":"DINING"},{"date":"2025-02-14","description":"PANERA BREAD","amount":-28.13,"category":"DINING"},{"date":"2025-02-14","description":"BEST BUY","amount":-141.23,"category":"DISCRETIONARY"},{"date":"2025-02-14","description":"CVS PHARMACY","amount":-23.89,"category":"HEALTHCARE"},{"date":"2025-02-16","description":"STARBUCKS","amount":-23.13,"category":"DINING"},{"date":"2025-02-16","description":"LOCAL PIZZA CO","amount":-60.8,"category":"DINING"},{"date":"2025-02-16","description":"SWEETGREEN","amount":-14.05,"category":"DINING"},{"date":"2025-02-17","description":"SWEETGREEN","amount":-66.7,"category":"DINING"},{"date":"2025-02-18","description":"SHAKE SHACK","amount":-16.58,"category":"DINING"},{"date":"2025-02-19","description":"MCDONALDS","amount":-18.74,"category":"DINING"},{"date":"2025-02-20","description":"PANERA BREAD","amount":-33.97,"category":"DINING"},{"date":"2025-02-21","description":"MCDONALDS","amount":-53.56,"category":"DINING"},{"date":"2025-02-22","description":"FIVE GUYS","amount":-27.39,"category":"DINING"},{"date":"2025-02-22","description":"BLUE BOTTLE COFFEE","amount":-47.34,"category":"DINING"},{"date":"2025-02-22","description":"LYFT","amount":-21.4,"category":"ENTERTAINMENT"},{"date":"2025-02-22","description":"AMAZON.COM","amount":-37.59,"category":"DISCRETIONARY"},{"date":"2025-02-23","description":"MCDONALDS","amount":-35.64,"category":"DINING"},{"date":"2025-02-23","description":"APPLE APP STORE","amount":-4.68,"category":"ENTERTAINMENT"},{"date":"2025-02-24","description":"SWEETGREEN","amount":-28.95,"category":"DINING"},{"date":"2025-02-25","description":"LOCAL PIZZA CO","amount":-43.72,"category":"DINING"},{"date":"2025-02-27","description":"CHIPOTLE MEXICAN GRILL","amount":-22.51,"category":"DINING"},{"date":"2025-02-27","description":"CHIPOTLE MEXICAN GRILL","amount":-59.72,"category":"DINING"},{"date":"2025-03-01","description":"BLUE BOTTLE COFFEE","amount":-37.64,"category":"DINING"},{"date":"2025-03-02","description":"FIVE GUYS","amount":-64.2,"category":"DINING"},{"date":"2025-03-03","description":"NETFLIX","amount":-15.49,"category":"SUBSCRIPTIONS"},{"date":"2025-03-03","description":"SUSHI PALACE","amount":-23.34,"category":"DINING"},{"date":"2025-03-04","description":"SPOTIFY","amount":-10.99,"category":"SUBSCRIPTIONS"},{"date":"2025-03-04","description":"THAI ORCHID RESTAURANT","amount":-20.23,"category":"DINING"},{"date":"2025-03-05","description":"AMAZON PRIME","amount":-14.99,"category":"SUBSCRIPTIONS"},{"date":"2025-03-06","description":"CHATGPT PLUS","amount":-20.0,"category":"SUBSCRIPTIONS"},{"date":"2025-03-06","description":"THAI ORCHID RESTAURANT","amount":-33.26,"category":"DINING"},{"date":"2025-03-07","description":"GYM - PLANET FITNESS","amount":-24.99,"category":"SUBSCRIPTIONS"},{"date":"2025-03-07","description":"CHIPOTLE MEXICAN GRILL","amount":-48.73,"category":"DINING"},{"date":"2025-03-07","description":"BLUE BOTTLE COFFEE","amount":-14.81,"category":"DINING"},{"date":"2025-03-07","description":"LYFT","amount":-18.5,"category":"ENTERTAINMENT"},{"date":"2025-03-08","description":"HULU","amount":-17.99,"category":"SUBSCRIPTIONS"},{"date":"2025-03-08","description":"DUNKIN","amount":-56.23,"category":"DINING"},{"date":"2025-03-11","description":"SHAKE SHACK","amount":-33.89,"category":"DINING"},{"date":"2025-03-11","description":"AMAZON.COM","amount":-34.62,"category":"DISCRETIONARY"},{"date":"2025-03-12","description":"LOCAL PIZZA CO","amount":-60.59,"category":"DINING"},{"date":"2025-03-14","description":"MCDONALDS","amount":-14.78,"category":"DINING"},{"date":"2025-03-14","description":"BLUE BOTTLE COFFEE","amount":-67.96,"category":"DINING"},{"date":"2025-03-15","description":"SWEETGREEN","amount":-63.66,"category":"DINING"},{"date":"2025-03-15","description":"LOCAL PIZZA CO","amount":-18.81,"category":"DINING"},{"date":"2025-03-15","description":"AMC THEATERS","amount":-19.47,"category":"ENTERTAINMENT"},{"date":"2025-03-16","description":"LOCAL PIZZA CO","amount":-60.01,"category":"DINING"},{"date":"2025-03-17","description":"SHAKE SHACK","amount":-31.36,"category":"DINING"},{"date":"2025-03-17","description":"THAI ORCHID RESTAURANT","amount":-24.65,"category":"DINING"},{"date":"2025-03-17","description":"SUSHI PALACE","amount":-25.83,"category":"DINING"},{"date":"2025-03-17","description":"BARNES & NOBLE","amount":-27.77,"category":"ENTERTAINMENT"},{"date":"2025-03-18","description":"FIVE GUYS","amount":-67.73,"category":"DINING"},{"date":"2025-03-18","description":"MCDONALDS","amount":-48.05,"category":"DINING"},{"date":"2025-03-19","description":"LOCAL PIZZA CO","amount":-26.51,"category":"DINING"},{"date":"2025-03-19","description":"NIKE.COM","amount":-98.04,"category":"DISCRETIONARY"},{"date":"2025-03-20","description":"PANERA BREAD","amount":-52.41,"category":"DINING"},{"date":"2025-03-20","description":"CHIPOTLE MEXICAN GRILL","amount":-53.13,"category":"DINING"},{"date":"2025-03-20","description":"CHIPOTLE MEXICAN GRILL","amount":-11.96,"category":"DINING"},{"date":"2025-03-20","description":"URGENT CARE NYC","amount":-85.0,"category":"HEALTHCARE"},{"date":"2025-03-21","description":"MCDONALDS","amount":-18.29,"category":"DINING"},{"date":"2025-03-22","description":"SWEETGREEN","amount":-59.23,"category":"DINING"},{"date":"2025-03-22","description":"SWEETGREEN","amount":-44.11,"category":"DINING"},{"date":"2025-03-22","description":"BLUE BOTTLE COFFEE","amount":-59.85,"category":"DINING"},{"date":"2025-03-23","description":"PANERA BREAD","amount":-23.53,"category":"DINING"},{"date":"2025-03-24","description":"PANERA BREAD","amount":-13.84,"category":"DINING"},{"date":"2025-03-25","description":"PANERA BREAD","amount":-39.84,"category":"DINING"},{"date":"2025-03-25","description":"STARBUCKS","amount":-21.05,"category":"DINING"},{"date":"2025-03-26","description":"LOCAL PIZZA CO","amount":-24.67,"category":"DINING"},{"date":"2025-03-26","description":"SHAKE SHACK","amount":-48.63,"category":"DINING"},{"date":"2025-03-26","description":"STEAM GAMES","amount":-32.11,"category":"ENTERTAINMENT"},{"date":"2025-03-27","description":"DUNKIN","amount":-63.81,"category":"DINING"},{"date":"2025-03-28","description":"CHIPOTLE MEXICAN GRILL","amount":-36.04,"category":"DINING"},{"date":"2025-03-28","description":"PANERA BREAD","amount":-67.77,"category":"DINING"},{"date":"2025-03-28","description":"SWEETGREEN","amount":-40.72,"category":"DINING"},{"date":"2025-03-29","description":"SHAKE SHACK","amount":-64.06,"category":"DINING"},{"date":"2025-03-30","description":"LOCAL PIZZA CO","amount":-30.8,"category":"DINING"},{"date":"2025-03-30","description":"SHAKE SHACK","amount":-34.85,"category":"DINING"},{"date":"2025-03-31","description":"STARBUCKS","amount":-45.09,"category":"DINING"},{"date":"2025-04-01","description":"BLUE BOTTLE COFFEE","amount":-40.21,"category":"DINING"},{"date":"2025-04-01","description":"BLUE BOTTLE COFFEE","amount":-57.21,"category":"DINING"},{"date":"2025-04-01","description":"STARBUCKS","amount":-63.97,"category":"DINING"},{"date":"2025-04-03","description":"NETFLIX","amount":-15.49,"category":"SUBSCRIPTIONS"},{"date":"2025-04-03","description":"STARBUCKS","amount":-15.81,"category":"DINING"},{"date":"2025-04-03","description":"SWEETGREEN","amount":-52.8,"category":"DINING"},{"date":"2025-04-04","description":"SPOTIFY","amount":-10.99,"category":"SUBSCRIPTIONS"},{"date":"2025-04-05","description":"AMAZON PRIME","amount":-14.99,"category":"SUBSCRIPTIONS"},{"date":"2025-04-05","description":"LOCAL PIZZA CO","amount":-51.34,"category":"DINING"},{"date":"2025-04-05","description":"AMAZON.COM","amount":-30.0,"category":"DISCRETIONARY"},{"date":"2025-04-06","description":"CHATGPT PLUS","amount":-20.0,"category":"SUBSCRIPTIONS"},{"date":"2025-04-06","description":"BLUE BOTTLE COFFEE","amount":-59.32,"category":"DINING"},{"date":"2025-04-07","description":"GYM - PLANET FITNESS","amount":-24.99,"category":"SUBSCRIPTIONS"},{"date":"2025-04-07","description":"STARBUCKS","amount":-62.41,"category":"DINING"},{"date":"2025-04-08","description":"HULU","amount":-17.99,"category":"SUBSCRIPTIONS"},{"date":"2025-04-08","description":"SWEETGREEN","amount":-46.42,"category":"DINING"},{"date":"2025-04-08","description":"STARBUCKS","amount":-11.6,"category":"DINING"},{"date":"2025-04-08","description":"TICKETMASTER","amount":-89.41,"category":"DISCRETIONARY"},{"date":"2025-04-08","description":"LYFT","amount":-20.64,"category":"ENTERTAINMENT"},{"date":"2025-04-08","description":"APPLE APP STORE","amount":-5.71,"category":"ENTERTAINMENT"},{"date":"2025-04-09","description":"SHAKE SHACK","amount":-46.59,"category":"DINING"},{"date":"2025-04-10","description":"FIVE GUYS","amount":-35.07,"category":"DINING"},{"date":"2025-04-11","description":"MCDONALDS","amount":-9.57,"category":"DINING"},{"date":"2025-04-11","description":"SWEETGREEN","amount":-64.76,"category":"DINING"},{"date":"2025-04-12","description":"SHAKE SHACK","amount":-41.19,"category":"DINING"},{"date":"2025-04-12","description":"DUNKIN","amount":-43.37,"category":"DINING"},{"date":"2025-04-14","description":"CVS PHARMACY","amount":-32.78,"category":"HEALTHCARE"},{"date":"2025-04-15","description":"CHIPOTLE MEXICAN GRILL","amount":-62.04,"category":"DINING"},{"date":"2025-04-16","description":"LOCAL PIZZA CO","amount":-48.35,"category":"DINING"},{"date":"2025-04-17","description":"MCDONALDS","amount":-61.16,"category":"DINING"},{"date":"2025-04-18","description":"PANERA BREAD","amount":-53.22,"category":"DINING"},{"date":"2025-04-19","description":"LOCAL PIZZA CO","amount":-60.01,"category":"DINING"},{"date":"2025-04-19","description":"SHAKE SHACK","amount":-61.0,"category":"DINING"},{"date":"2025-04-19","description":"CHIPOTLE MEXICAN GRILL","amount":-19.58,"category":"DINING"},{"date":"2025-04-20","description":"THAI ORCHID RESTAURANT","amount":-56.33,"category":"DINING"},{"date":"2025-04-20","description":"FIVE GUYS","amount":-56.83,"category":"DINING"},{"date":"2025-04-20","description":"STARBUCKS","amount":-18.39,"category":"DINING"},{"date":"2025-04-20","description":"AMC THEATERS","amount":-20.44,"category":"ENTERTAINMENT"},{"date":"2025-04-21","description":"THAI ORCHID RESTAURANT","amount":-60.46,"category":"DINING"},{"date":"2025-04-21","description":"SUSHI PALACE","amount":-22.12,"category":"DINING"},{"date":"2025-04-22","description":"SUSHI PALACE","amount":-29.63,"category":"DINING"},{"date":"2025-04-22","description":"LOCAL PIZZA CO","amount":-22.15,"category":"DINING"},{"date":"2025-04-23","description":"THAI ORCHID RESTAURANT","amount":-28.37,"category":"DINING"},{"date":"2025-04-23","description":"SWEETGREEN","amount":-66.05,"category":"DINING"},{"date":"2025-04-24","description":"BLUE BOTTLE COFFEE","amount":-39.05,"category":"DINING"},{"date":"2025-04-25","description":"MCDONALDS","amount":-28.54,"category":"DINING"},{"date":"2025-04-25","description":"CHIPOTLE MEXICAN GRILL","amount":-15.81,"category":"DINING"},{"date":"2025-04-26","description":"SHAKE SHACK","amount":-43.25,"category":"DINING"},{"date":"2025-04-26","description":"STARBUCKS","amount":-11.26,"category":"DINING"},{"date":"2025-04-26","description":"PANERA BREAD","amount":-34.64,"category":"DINING"},{"date":"2025-04-27","description":"DUNKIN","amount":-34.75,"category":"DINING"},{"date":"2025-04-27","description":"MCDONALDS","amount":-15.82,"category":"DINING"},{"date":"2025-04-27","description":"H&M","amount":-59.05,"category":"DISCRETIONARY"},{"date":"2025-04-28","description":"LOCAL PIZZA CO","amount":-24.03,"category":"DINING"},{"date":"2025-04-28","description":"FIVE GUYS","amount":-34.73,"category":"DINING"},{"date":"2025-04-29","description":"MCDONALDS","amount":-49.52,"category":"DINING"},{"date":"2025-04-30","description":"FIVE GUYS","amount":-48.57,"category":"DINING"},{"date":"2025-04-30","description":"DUNKIN","amount":-34.45,"category":"DINING"},{"date":"2025-04-30","description":"BLUE BOTTLE COFFEE","amount":-63.33,"category":"DINING"}];

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg:"#0A0C0F", surface:"#111418", surfaceUp:"#181C22",
  border:"#1E2530", borderLight:"#252D38",
  accent:"#00D4AA", accentDim:"rgba(0,212,170,0.12)",
  warn:"#F59E0B", danger:"#EF4444",
  text:"#E8ECF0", textMid:"#8A96A3", textDim:"#4A5568",
};

const fmt = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(n??0);

function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0,0,0,0);
  d.setDate(d.getDate()+3-((d.getDay()+6)%7));
  const w1 = new Date(d.getFullYear(),0,4);
  const wn = 1+Math.round(((d-w1)/86400000-3+((w1.getDay()+6)%7))/7);
  return `${d.getFullYear()}-W${String(wn).padStart(2,"0")}`;
}

// ── REGRESSION ENGINE ─────────────────────────────────────────────────────────
function buildModel(transactions) {
  const weeks = {};
  transactions.forEach(t => {
    const wk = getISOWeek(new Date(t.date));
    if (!weeks[wk]) weeks[wk] = {income:0,fixed:0,discretionary:0,variable:0};
    const amt = Math.abs(t.amount);
    if (t.amount > 0) weeks[wk].income += amt;
    else if (["RENT_MORTGAGE","UTILITIES","SUBSCRIPTIONS","OTHER_FIXED"].includes(t.category)) weeks[wk].fixed += amt;
    else if (["DISCRETIONARY","DINING","ENTERTAINMENT"].includes(t.category)) weeks[wk].discretionary += amt;
    else weeks[wk].variable += amt;
  });
  const keys = Object.keys(weeks).sort();
  const n = keys.length;
  if (n < 2) return null;
  const xs = keys.map((_,i)=>i);
  const ys = keys.map(k=>weeks[k].discretionary);
  const ws = xs.map((_,i)=>Math.pow(1.15,i));
  const wS=ws.reduce((a,b)=>a+b,0);
  const wxS=xs.reduce((s,x,i)=>s+ws[i]*x,0);
  const wyS=ys.reduce((s,y,i)=>s+ws[i]*y,0);
  const wxxS=xs.reduce((s,x,i)=>s+ws[i]*x*x,0);
  const wxyS=xs.reduce((s,x,i)=>s+ws[i]*x*ys[i],0);
  const den=wS*wxxS-wxS*wxS;
  const slope=den!==0?(wS*wxyS-wxS*wyS)/den:0;
  const intercept=(wyS-slope*wxS)/wS;
  const incomeDates=transactions.filter(t=>t.category==="INCOME"&&t.amount>0).map(t=>new Date(t.date).getTime()).sort((a,b)=>a-b);
  let payPeriod=14;
  if(incomeDates.length>1){const gaps=incomeDates.slice(1).map((d,i)=>(d-incomeDates[i])/86400000).filter(g=>g>5&&g<40);if(gaps.length)payPeriod=gaps.reduce((a,b)=>a+b,0)/gaps.length;}
  const avgIncome=keys.reduce((s,k)=>s+weeks[k].income,0)/n;
  const avgFixed=keys.reduce((s,k)=>s+weeks[k].fixed,0)/n;
  return {weeks,keys,slope,intercept,avgIncome,avgFixed,payPeriod,n};
}

function forecast(model, numWeeks=8) {
  const {keys,slope,intercept,avgIncome,avgFixed,payPeriod,n} = model;
  const today = new Date();
  return Array.from({length:numWeeks},(_,i)=>{
    const projected = Math.max(0, intercept+slope*(n+i));
    const weekStart = new Date(today.getTime()+i*7*86400000);
    const payWeek = Math.floor(weekStart.getTime()/(payPeriod*86400000/2))%2===0;
    const income = payWeek ? avgIncome*2 : 0;
    const disposable = income - avgFixed - projected;
    return {
      week:`W+${i+1}`,
      label:weekStart.toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      projected:Math.round(projected), income:Math.round(income),
      fixed:Math.round(avgFixed), disposable:Math.round(disposable),
      cashflow:Math.round(income-avgFixed-projected),
    };
  });
}

// ── UI PRIMITIVES ─────────────────────────────────────────────────────────────
const Card = ({children,style={}}) => (
  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20,...style}}>
    {children}
  </div>
);

const Stat = ({label,value,sub,color=C.text,large}) => (
  <div>
    <div style={{fontSize:10,color:C.textMid,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:4}}>{label}</div>
    <div style={{fontSize:large?30:20,fontWeight:700,color,fontVariantNumeric:"tabular-nums",lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:C.textDim,marginTop:4}}>{sub}</div>}
  </div>
);

const Badge = ({children,color=C.accent}) => (
  <span style={{display:"inline-block",padding:"2px 7px",borderRadius:4,fontSize:9,fontWeight:700,
    letterSpacing:"0.07em",background:color+"22",color,border:`1px solid ${color}44`,textTransform:"uppercase"}}>
    {children}
  </span>
);

const TT = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return (
    <div style={{background:C.surfaceUp,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontSize:11}}>
      <div style={{color:C.textMid,marginBottom:5}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{color:p.color,marginBottom:2}}>{p.name}: <strong>{fmt(p.value)}</strong></div>
      ))}
    </div>
  );
};

// ── HISTORY CHART DATA ────────────────────────────────────────────────────────
function buildHistoryChart(model) {
  return model.keys.map((k,i)=>({
    week: k.replace("2025-",""),
    income: Math.round(model.weeks[k].income),
    fixed: Math.round(model.weeks[k].fixed),
    discretionary: Math.round(model.weeks[k].discretionary),
    predicted: Math.round(Math.max(0, model.intercept + model.slope*i)),
  }));
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeAccount, setActiveAccount] = useState({checking:true,savings:true,credit:true});
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQ, setSearchQ] = useState("");

  const allTransactions = useMemo(()=>{
    const src = [
      ...(activeAccount.checking ? SAMPLE_CHECKING : []),
      ...(activeAccount.savings  ? SAMPLE_SAVINGS  : []),
      ...(activeAccount.credit   ? SAMPLE_CREDIT   : []),
    ];
    return src.sort((a,b)=>new Date(a.date)-new Date(b.date));
  },[activeAccount]);

  const model   = useMemo(()=>buildModel(allTransactions),[allTransactions]);
  const fc      = useMemo(()=>model?forecast(model,8):[],[model]);
  const thisWeek = fc[0];

  const catData = useMemo(()=>{
    const cats={};
    allTransactions.filter(t=>t.amount<0).forEach(t=>{cats[t.category]=(cats[t.category]||0)+Math.abs(t.amount);});
    return Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,9).map(([cat,amt])=>({cat:cat.replace(/_/g," "),amt:Math.round(amt)}));
  },[allTransactions]);

  const historyData = useMemo(()=>model?buildHistoryChart(model):[],[model]);

  const filtered = useMemo(()=>{
    if(!searchQ) return [...allTransactions].reverse();
    const q=searchQ.toLowerCase();
    return [...allTransactions].reverse().filter(t=>t.description.toLowerCase().includes(q)||t.category.toLowerCase().includes(q));
  },[allTransactions,searchQ]);

  const totalIncome    = allTransactions.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
  const totalSpend     = allTransactions.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
  const netSaved       = totalIncome - totalSpend;
  const tabs = ["dashboard","history","forecast","categories","transactions"];

  const accountTotals = {
    checking: SAMPLE_CHECKING.reduce((s,t)=>s+t.amount,0),
    savings:  SAMPLE_SAVINGS.reduce((s,t)=>s+t.amount,0),
    credit:   SAMPLE_CREDIT.reduce((s,t)=>s+t.amount,0),
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Mono','Fira Code',monospace",fontSize:14}}>

      {/* Header */}
      <div style={{borderBottom:`1px solid ${C.border}`,padding:"14px 24px",background:C.surface,
        display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#00D4AA,#7C3AED)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>◈</div>
          <div>
            <div style={{fontWeight:700,fontSize:14,letterSpacing:"0.05em"}}>BENA</div>
            <div style={{fontSize:9,color:C.textDim,letterSpacing:"0.08em"}}>YOUR MONEY, CLEARLY · DEMO MODE</div>
          </div>
        </div>
        {/* Account toggles */}
        <div style={{display:"flex",gap:6}}>
          {["checking","savings","credit"].map(acc=>(
            <button key={acc} onClick={()=>setActiveAccount(p=>({...p,[acc]:!p[acc]}))} style={{
              padding:"5px 12px",borderRadius:6,border:`1px solid ${activeAccount[acc]?C.accent+"66":C.borderLight}`,
              background:activeAccount[acc]?C.accentDim:"transparent",
              color:activeAccount[acc]?C.accent:C.textDim,
              cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:"0.06em",fontFamily:"inherit",
            }}>{acc.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:1080,margin:"0 auto",padding:"24px 20px"}}>

        {/* Account Summary Strip */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
          {[
            {label:"Checking Net Flow",val:accountTotals.checking,sub:"3-month net"},
            {label:"Savings Net Flow", val:accountTotals.savings, sub:"transfers + interest"},
            {label:"Credit Card Charges",val:accountTotals.credit,sub:"total charges"},
          ].map((s,i)=>(
            <Card key={i} style={{padding:16}}>
              <div style={{fontSize:10,color:C.textMid,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:6}}>{s.label}</div>
              <div style={{fontSize:20,fontWeight:700,color:s.val>0?"#4ADE80":C.danger,fontVariantNumeric:"tabular-nums"}}>
                {s.val>0?"+":""}{fmt(s.val)}
              </div>
              <div style={{fontSize:10,color:C.textDim,marginTop:3}}>{s.sub}</div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:0,marginBottom:20,borderBottom:`1px solid ${C.border}`}}>
          {tabs.map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{
              padding:"8px 16px",background:"none",border:"none",
              borderBottom:`2px solid ${activeTab===tab?C.accent:"transparent"}`,
              color:activeTab===tab?C.accent:C.textMid,
              cursor:"pointer",fontSize:10,fontWeight:700,letterSpacing:"0.08em",
              textTransform:"uppercase",fontFamily:"inherit",marginBottom:-1,
            }}>{tab}</button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {activeTab==="dashboard" && model && (
          <>
            {/* Insight Banner */}
            <div style={{background:C.accentDim,border:`1px solid ${C.accent}44`,borderRadius:10,
              padding:"12px 18px",marginBottom:20,display:"flex",gap:12}}>
              <div style={{color:C.accent,fontSize:18}}>◈</div>
              <div>
                <div style={{fontSize:9,color:C.accent,fontWeight:700,letterSpacing:"0.08em",marginBottom:4}}>ANALYSIS COMPLETE · 222 TRANSACTIONS · 13 WEEKS</div>
                <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>
                  Dining out accounts for your largest discretionary spend at <strong style={{color:C.warn}}>{fmt(catData.find(c=>c.cat==="DINING")?.amt||0)}</strong> over 3 months — nearly 3× groceries.
                  Your spending trend is <strong style={{color:model.slope>0?C.danger:C.accent}}>{model.slope>0?"↑ increasing":"↓ decreasing"}</strong> by ~{fmt(Math.abs(model.slope))}/week.
                  With biweekly pay of <strong style={{color:"#4ADE80"}}>{fmt(model.avgIncome*2)}</strong>, you have an estimated <strong style={{color:C.accent}}>{fmt(thisWeek?.disposable)}</strong> free this week after all obligations.
                </div>
              </div>
            </div>

            {/* Hero stat */}
            <Card style={{marginBottom:14,background:thisWeek?.disposable>0?C.accentDim:"rgba(239,68,68,0.08)",
              borderColor:thisWeek?.disposable>0?C.accent+"44":C.danger+"44"}}>
              <Stat label="Safe to Spend This Week" value={fmt(thisWeek?.disposable)}
                sub="after rent, utilities, subscriptions & projected variable spend"
                color={thisWeek?.disposable>0?C.accent:C.danger} large />
            </Card>

            {/* 4-stat row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
              <Card><Stat label="Biweekly Paycheck" value={fmt(model.avgIncome*2)} sub={`~every ${Math.round(model.avgPayPeriod)}d`} color="#4ADE80"/></Card>
              <Card><Stat label="Weekly Fixed Costs" value={fmt(model.avgFixed)} sub="rent+utils+subs" color={C.danger}/></Card>
              <Card><Stat label="Projected Spend/Wk" value={fmt(fc[0]?.projected)} sub={model.slope>0?"↑ trending up":"↓ trending down"} color={model.slope>0?C.warn:C.accent}/></Card>
              <Card><Stat label="3-Month Net Saved" value={fmt(netSaved)} sub="income minus all spend" color={netSaved>0?"#4ADE80":C.danger}/></Card>
            </div>

            {/* Cash flow chart */}
            <Card style={{marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:C.textMid,marginBottom:14}}>8-WEEK FORWARD CASH FLOW FORECAST</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={fc}>
                  <defs>
                    <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.accent} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.accent} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="label" tick={{fill:C.textDim,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tickFormatter={v=>`$${v}`} tick={{fill:C.textDim,fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TT/>}/>
                  <ReferenceLine y={0} stroke={C.danger} strokeDasharray="4 4"/>
                  <Area type="monotone" dataKey="cashflow" name="Net Cash Flow" stroke={C.accent} fill="url(#gA)" strokeWidth={2} dot={false}/>
                  <Line type="monotone" dataKey="projected" name="Projected Spend" stroke={C.warn} strokeWidth={1.5} dot={false} strokeDasharray="4 4"/>
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Weekly cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {fc.slice(0,4).map((w,i)=>(
                <Card key={i} style={{padding:14}}>
                  <div style={{fontSize:10,color:C.textDim,marginBottom:6}}>{w.label}</div>
                  <div style={{fontSize:20,fontWeight:700,color:w.disposable>0?C.accent:C.danger,marginBottom:8}}>{fmt(w.disposable)}</div>
                  <div style={{fontSize:10,color:C.textDim,lineHeight:2}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span>income</span><span style={{color:"#4ADE80"}}>+{fmt(w.income)}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span>fixed</span><span style={{color:C.danger}}>-{fmt(w.fixed)}</span></div>
                    <div style={{display:"flex",justifyContent:"space-between"}}><span>spend</span><span style={{color:C.warn}}>-{fmt(w.projected)}</span></div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ── HISTORY ── */}
        {activeTab==="history" && model && (
          <>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:C.textMid,marginBottom:14}}>
                ACTUAL WEEKLY SPENDING — FEB to APR 2025 (with regression line)
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="week" tick={{fill:C.textDim,fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tickFormatter={v=>`$${v}`} tick={{fill:C.textDim,fontSize:9}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TT/>}/>
                  <Line type="monotone" dataKey="discretionary" name="Actual Spend" stroke={C.warn} strokeWidth={2} dot={{fill:C.warn,r:3}}/>
                  <Line type="monotone" dataKey="predicted" name="Regression" stroke={C.accent} strokeWidth={1.5} strokeDasharray="5 3" dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:C.textMid,marginBottom:14}}>
                WEEKLY INCOME vs FIXED vs DISCRETIONARY
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={historyData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="week" tick={{fill:C.textDim,fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis tickFormatter={v=>`$${v}`} tick={{fill:C.textDim,fontSize:9}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TT/>}/>
                  <Bar dataKey="income" name="Income" fill="#4ADE8033" stroke="#4ADE80" strokeWidth={1} radius={[3,3,0,0]}/>
                  <Bar dataKey="fixed" name="Fixed" fill={C.danger+"33"} stroke={C.danger} strokeWidth={1} radius={[3,3,0,0]}/>
                  <Bar dataKey="discretionary" name="Discretionary" fill={C.warn+"33"} stroke={C.warn} strokeWidth={1} radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}

        {/* ── FORECAST ── */}
        {activeTab==="forecast" && (
          <>
            <Card style={{marginBottom:16}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:C.textMid,marginBottom:14}}>
                8-WEEK FORECAST — INCOME vs OBLIGATIONS vs DISCRETIONARY
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={fc} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
                  <XAxis dataKey="label" tick={{fill:C.textDim,fontSize:10}} axisLine={false} tickLine={false}/>
                  <YAxis tickFormatter={v=>`$${v}`} tick={{fill:C.textDim,fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<TT/>}/>
                  <Bar dataKey="income" name="Income" fill="#4ADE8033" stroke="#4ADE80" strokeWidth={1} radius={[3,3,0,0]}/>
                  <Bar dataKey="fixed" name="Fixed" fill={C.danger+"33"} stroke={C.danger} strokeWidth={1} radius={[3,3,0,0]}/>
                  <Bar dataKey="projected" name="Variable" fill={C.warn+"33"} stroke={C.warn} strokeWidth={1} radius={[3,3,0,0]}/>
                  <Bar dataKey="disposable" name="Disposable" fill={C.accent+"33"} stroke={C.accent} strokeWidth={1} radius={[3,3,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {fc.map((w,i)=>(
                <div key={i} style={{padding:"12px 14px",background:C.surface,borderRadius:10,border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:10,color:C.textDim,marginBottom:4}}>{w.label}</div>
                  <div style={{fontSize:18,fontWeight:700,color:w.disposable>0?C.accent:C.danger}}>{fmt(w.disposable)}</div>
                  <div style={{fontSize:10,color:C.textDim,marginTop:6,lineHeight:1.9}}>
                    <div><span style={{color:"#4ADE80"}}>+{fmt(w.income)}</span> in</div>
                    <div><span style={{color:C.danger}}>-{fmt(w.fixed)}</span> fixed</div>
                    <div><span style={{color:C.warn}}>-{fmt(w.projected)}</span> spend</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── CATEGORIES ── */}
        {activeTab==="categories" && (
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <Card>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:C.textMid,marginBottom:14}}>SPENDING BY CATEGORY</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={catData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false}/>
                  <XAxis type="number" tickFormatter={v=>`$${v}`} tick={{fill:C.textDim,fontSize:9}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="cat" tick={{fill:C.textMid,fontSize:9}} axisLine={false} tickLine={false} width={100}/>
                  <Tooltip content={<TT/>}/>
                  <Bar dataKey="amt" name="Total" fill={C.accent+"44"} stroke={C.accent} strokeWidth={1} radius={[0,4,4,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {catData.map((c,i)=>{
                const pct = Math.round(c.amt/catData.reduce((s,x)=>s+x.amt,0)*100);
                const colors=[C.accent,C.warn,C.danger,"#A78BFA","#60A5FA","#F472B6","#34D399","#FB923C","#94A3B8"];
                return (
                  <div key={i} style={{padding:"10px 14px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                      <span style={{fontSize:11,color:C.textMid}}>{c.cat}</span>
                      <span style={{fontSize:12,fontWeight:700,color:colors[i]}}>{fmt(c.amt)}</span>
                    </div>
                    <div style={{height:4,background:C.border,borderRadius:2}}>
                      <div style={{height:4,width:`${pct}%`,background:colors[i],borderRadius:2}}/>
                    </div>
                    <div style={{fontSize:9,color:C.textDim,marginTop:3}}>{pct}% of total spend</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {activeTab==="transactions" && (
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:C.textMid}}>
                ALL TRANSACTIONS ({filtered.length}/{allTransactions.length})
              </div>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                placeholder="search descriptions…"
                style={{background:C.surfaceUp,border:`1px solid ${C.borderLight}`,borderRadius:6,
                  padding:"6px 12px",color:C.text,fontSize:11,fontFamily:"inherit",outline:"none",width:200}}/>
            </div>
            <div style={{maxHeight:520,overflowY:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead style={{position:"sticky",top:0,background:C.surface}}>
                  <tr style={{borderBottom:`1px solid ${C.border}`}}>
                    {["Date","Account","Description","Category","Amount"].map(h=>(
                      <th key={h} style={{textAlign:"left",padding:"6px 10px",color:C.textDim,fontWeight:600,fontSize:9,letterSpacing:"0.06em"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t,i)=>{
                    const acct = SAMPLE_CHECKING.includes(t)?"CHK":SAMPLE_SAVINGS.includes(t)?"SAV":"CC";
                    return (
                      <tr key={i} style={{borderBottom:`1px solid ${C.border}22`}}>
                        <td style={{padding:"6px 10px",color:C.textDim,whiteSpace:"nowrap"}}>{t.date}</td>
                        <td style={{padding:"6px 10px"}}>
                          <Badge color={acct==="CHK"?C.accent:acct==="SAV"?"#60A5FA":"#A78BFA"}>{acct}</Badge>
                        </td>
                        <td style={{padding:"6px 10px",color:C.text,maxWidth:240,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.description}</td>
                        <td style={{padding:"6px 10px"}}>
                          <Badge color={t.category==="INCOME"?"#4ADE80":t.amount<-100?C.warn:C.textMid}>{t.category?.replace(/_/g," ")}</Badge>
                        </td>
                        <td style={{padding:"6px 10px",fontWeight:600,color:t.amount>0?"#4ADE80":C.text,textAlign:"right",whiteSpace:"nowrap"}}>
                          {t.amount>0?"+":""}{fmt(t.amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <div style={{marginTop:28,paddingTop:14,borderTop:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",fontSize:9,color:C.textDim}}>
          <span>BENA v1.0 · DEMO MODE · Sample Data Feb–Apr 2025</span>
          <span>Plaid · Brokerage — coming soon</span>
        </div>
      </div>
    </div>
  );
}
