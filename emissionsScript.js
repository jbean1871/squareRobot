let input_fuelType = document.getElementById('ec_fuel-type')
let input_tankDiameter = document.getElementById('ec_tank-diameter');
// let input_tankHeight = document.getElementById('ec_tank-height');
let input_legHeight = document.getElementById('ec_leg-height');
let input_roofType = document.getElementById('ec_roof-type');
let input_roofShape = document.getElementById('ec_roof-shape');
let inputsArr = [input_fuelType, input_tankDiameter, input_legHeight, input_roofType, input_roofShape]

inputsArr.forEach(input => {
  input.addEventListener('change', () => {
    inputs()
  })
})

const inputGroupsArr = document.querySelectorAll('.sr__range-group');
inputGroupsArr.forEach((group) => {
  const range = group.querySelector('.sr__range');
  const number = group.querySelector('.sr__number');
  range.addEventListener('input', (e) => {
    number.value = e.target.value;
    inputs()
  });
  number.addEventListener('input', (e) => {
    range.value = e.target.value;
    inputs()
  });
});



inputs()
function inputs(){

  /*--------------------------------------------------------
    User Input
  ---------------------------------------------------------*/
  let value_fuelType = input_fuelType.value;
  let value_tankDiameter = input_tankDiameter.value;
  // let value_tankHeight = input_tankHeight.value;
  let value_legHeight = input_legHeight.value;
  let value_roofType = input_roofType.value;
  let value_roofShape = input_roofShape.value;
  
  /*--------------------------------------------------------
    Fuel Properties
  ---------------------------------------------------------*/
  let molsCarbonPerGFuel = 0.865 / 12.011;
  let gwp = molsCarbonPerGFuel * 44;
  ///Col - C,D,E,F,G,H,I,J,K 
  const fuels = {
    diesel: [0.01, 130.00, 188.00, 12.101, 8907.00, 7.10, 86.5, molsCarbonPerGFuel, molsCarbonPerGFuel], // 5
    jetFuel: [0.01, 130.00, 162.00, 12.39, 8933.00, 7.00, 86.5, molsCarbonPerGFuel, molsCarbonPerGFuel], //6
    kerosene: [0.01, 130.00, 162.00, 12.39, 8933.00, 7.00, 86.5, molsCarbonPerGFuel, molsCarbonPerGFuel], //7
    gasoline: [5.20, 66.00, 92.00, 11.724, 5237.30, 5.60, 86.5, molsCarbonPerGFuel, molsCarbonPerGFuel], //8
    motorGasolineRVP13: [7.00, 62.00, 92.00, 11.644, 5043.60, 5.60, 86.5, molsCarbonPerGFuel, molsCarbonPerGFuel], //9
    motorGasolineRVP10: [5.20, 66.00, 92.00, 11.724, 5237.30, 5.60, 86.5, molsCarbonPerGFuel, molsCarbonPerGFuel], //10
    motorGasolineRVP7: [3.50, 68.00, 92.00, 11.833, 5500.60, 5.60, 86.5, molsCarbonPerGFuel, molsCarbonPerGFuel] //10
  }

  /*--------------------------------------------------------
    Inputs
  ---------------------------------------------------------*/
  //Project Information
  let i_atmophericPressureLocation = 14.696; //11

  // Tank Parameters
  let i_fuelType = value_fuelType || "gasoline"; //15
  let i_roofType = value_roofType || "external-floating"; //16
  let i_roofShape = value_roofShape || "Dome"; //17
  let i_tankDiameter = value_tankDiameter || 100; //18
  let i_tankHeight = 40; //19
  let i_legHeight = value_legHeight; //20


  let i_controlEfficiency = 0;

  //Project Measures
  let i_liquidLevel = 15; //29 
  let i_avgTemp = 66; //30
  let i_avgDailyMinTemp = 56; //31
  let i_avgDailyMaxTemp = 78; //32
  let i_sludgeSedimentDepth = 0.5 //33
  let i_vaporPressure = 0; //34
  let i_productDensity = 7.194; //35


  /*--------------------------------------------------------
  Parameters & Assumptions
  ---------------------------------------------------------*/
  //Constants
  let pa_idealGasConstant = 10.731; //39
  let pa_volConversion = 7.4805; //40
  let pa_massConversion = 2.2046; //41

  //Assumptions
  let pa_atmophericPressure = i_atmophericPressureLocation; //44

  //Temperature
  let pa_avgLiquidTempF = i_avgTemp; //33
  let pa_avgLiquidTempR = parseFloat((pa_avgLiquidTempF + 459.67).toFixed(2)); //33
  let pa_avgDailyMinTempF = i_avgDailyMinTemp; //34
  let pa_avgDailyMinTempR = i_avgDailyMinTemp + 459.67; //34
  let pa_avgDailyMaxTempF = i_avgDailyMaxTemp; //35
  let pa_avgDailyMaxTempR = i_avgDailyMaxTemp + 459.67; //35
  let pa_avgAmbientTempF = 60; //36
  let pa_avgAmbientTempR = parseFloat((60 + 459.67).toFixed(2)); //36

  

  //Fuel Characteristics
  let pa_fuelType = i_fuelType; //21
  let pa_vaporMolecularWeight = fuels[pa_fuelType][1]; //22
  let pa_liquidMolecularWeight = fuels[pa_fuelType][2]; //23
  let pa_density = i_productDensity || fuels[pa_fuelType][5]; //24
  let pa_vaporPressureConstA =   fuels[pa_fuelType][3]; //26
  let pa_vaporPressureConstB =   fuels[pa_fuelType][4]; //27
  let pa_trueVaporPressure = parseFloat(Math.exp(pa_vaporPressureConstA - pa_vaporPressureConstB / pa_avgLiquidTempR).toFixed(5)); //25 
  let pa_vaporPressureMaxDailyTemp = Math.exp(pa_vaporPressureConstA - pa_vaporPressureConstB / pa_avgDailyMaxTempR); //28
  let pa_vaporPressureMinDailyTemp = Math.exp(pa_vaporPressureConstA - pa_vaporPressureConstB / pa_avgDailyMinTempR); //29
  let pa_vaporDensity = pa_vaporMolecularWeight * pa_trueVaporPressure / (pa_idealGasConstant * pa_avgAmbientTempR); //30
  //Tank Characteristics
  let pa_tankHeight = i_tankHeight; //3 
  let pa_tankDiameter = parseInt(i_tankDiameter); //4
  let pa_roofType = i_roofType; //5
  let pa_roofShape = i_roofShape; //6
  let pa_legHeight = i_legHeight; //7
  let pa_roofSlope = 0.0625; //8
  let pa_roofOutage = i_roofShape == "cone" ? pa_roofSlope * pa_tankDiameter / 6 : 0.137 * (pa_tankDiameter / 2); //9 
  let pa_sludgeDepth = i_sludgeSedimentDepth / 12; //13
  let pa_vaporSpaceOutage =  i_tankHeight - pa_sludgeDepth + pa_roofOutage; //10
  let pa_tankBottomArea =  Math.PI * Math.pow((pa_tankDiameter / 2), 2); //11
  let pa_maxTankVol = i_roofType == "Floating" ? pa_tankBottomArea * pa_tankHeight : pa_tankBottomArea * (pa_tankHeight + pa_roofSlope * pa_tankDiameter/6); //12
  let pa_vaporSpaceVol = pa_roofType == "Fixed" ? pa_vaporSpaceOutage * (Math.PI * Math.pow(pa_tankDiameter, 2) / 4 ) : pa_tankBottomArea * (pa_legHeight - pa_sludgeDepth); //DOUBLE CHECK 14
  let pa_maxFuelReamainingVol = pa_sludgeDepth * pa_tankBottomArea * pa_volConversion; //15
  let pa_maxFuelReamainingMass = pa_density * pa_maxFuelReamainingVol; //16
  let pa_initialLiquidLevel = i_liquidLevel; //17
  let pa_initialLiquidVol = pa_initialLiquidLevel * pa_tankBottomArea; //18
  


  /*--------------------------------------------------------
  Pumpout
  ---------------------------------------------------------*/
  //Fixed Roof Tank
  let p_totalpumpoutEmissions = 0 //13

  //Internal or Domed External Floating Roof Tank
  let p_NumDaysIdle = 1; //18
  let p_avgDailyTempRange = i_avgDailyMaxTemp - i_avgDailyMinTemp; //20
  let p_avgTemp = i_avgDailyMaxTemp; //21
  let p_avgDailyVaporPressueRange = pa_vaporPressureMaxDailyTemp - pa_vaporPressureMinDailyTemp; //22
  let p_atmosphericPressure = pa_atmophericPressure; //23
  let p_vaporPressueStockLiquid = pa_trueVaporPressure; //25
  let p_vaporSpaceExpansionFactor = (p_avgDailyTempRange / p_avgTemp) + p_avgDailyVaporPressueRange / (p_atmosphericPressure - p_vaporPressueStockLiquid); //24
  let volVaporSpace = pa_vaporSpaceVol; //26
  let p_idealgasConstant = pa_idealGasConstant; //27
  let p_avgVaporTemp = pa_avgLiquidTempR; //28
  let p_vaporMolecularWeight = pa_vaporMolecularWeight //29
  let p_standingIdleSaturationFactor = 0.5; //30
  
  //Total
  let p_StandingIdleLosses = (p_NumDaysIdle*p_vaporSpaceExpansionFactor * (p_vaporPressueStockLiquid * volVaporSpace) / (p_idealgasConstant * p_avgVaporTemp) * p_vaporMolecularWeight * p_standingIdleSaturationFactor); //31
  

  //Other External Floating Roof Tank
  let p_numberDaysIdle = 1; //36
  let p_tankDiameter = i_tankDiameter; //37
  let p_vaporPressureFunction = (p_vaporPressueStockLiquid/p_atmosphericPressure) / Math.pow((1 + Math.sqrt(1 - p_vaporPressueStockLiquid/p_atmosphericPressure) ), 2); //39
  let p_windLoss = 0.57 * p_numberDaysIdle * p_tankDiameter * p_vaporPressureFunction * p_vaporMolecularWeight; //40
  let p_totalRoofLandingLosses = pa_roofType == "external-floating" && pa_roofShape !== "Dome" ? p_StandingIdleLosses + p_windLoss : p_StandingIdleLosses; //41

  /*--------------------------------------------------------
  Refilling
  ---------------------------------------------------------*/
  //Fixed Roof Tank
  let r_netWorkingLossThroughput = pa_initialLiquidVol; //13
  let r_workingLossSaturationFactor = 1; //14
  let r_workingLossProductFactor = 1; //15
  let r_vaporDensity = pa_vaporDensity; //16
  let r_ventSettingCorrectionFactor = 1; //17
  let r_totalEmissionsLW = r_netWorkingLossThroughput * r_workingLossSaturationFactor * r_workingLossProductFactor * r_vaporDensity * r_ventSettingCorrectionFactor; //18
  //Floating Roof Tank
  let r_trueVaporPressure = pa_trueVaporPressure; //24
  let r_vaprSpaceVol = pa_vaporSpaceVol; //25
  let r_idealGasConstant = pa_idealGasConstant; //26
  let r_avgVaporTemp = pa_avgAmbientTempR; //27
  let r_stockVaporMolecularWeight = pa_vaporMolecularWeight; //28
  let r_fillingSaturationCorrectionFactorWind = 1; //29
  let r_fillingSaturationFactor = 0.15; //30
  let r_totalEmissionsLfl = r_trueVaporPressure * r_vaprSpaceVol / (r_idealGasConstant * r_avgVaporTemp) * r_stockVaporMolecularWeight * r_fillingSaturationCorrectionFactorWind * r_fillingSaturationFactor;

  /*--------------------------------------------------------
  Ventilation
  ---------------------------------------------------------*/
  let v_remainingMaterialVol = pa_maxFuelReamainingVol; //10
  let v_remainingMaterialMass = pa_maxFuelReamainingMass; //11
  let v_volatiles = .20; //12
  let v_emissionsFromVentilation = v_remainingMaterialMass * v_volatiles; //13
  let vaporControlEfficiency = i_controlEfficiency; //15
  let v_totalEmissions = v_emissionsFromVentilation; //16 //removed vaporControlEfficiency which relayed control efficiency


  /*--------------------------------------------------------
  Project Results
  ---------------------------------------------------------*/
  let pr_gwp = gwp;

  let pr_pumpoutTotalEmissions = parseFloat(i_roofType == "fixed" ? p_totalpumpoutEmissions : p_totalRoofLandingLosses); //I7
  let pr_ventilation = v_totalEmissions; //I8
  let pr_refilling = parseFloat(i_roofType == "fixed" ? r_totalEmissionsLW : r_totalEmissionsLfl); //I9
  let pr_totalEmissions = pr_pumpoutTotalEmissions + pr_ventilation + pr_refilling; //I10
  console.log(pr_pumpoutTotalEmissions)
  console.log(pr_ventilation)
  console.log(pr_refilling)
  console.log(pr_totalEmissions)
  
  let pr_pumpOutGHGImpactLblCO2e = pr_pumpoutTotalEmissions * pr_gwp; //J7
  let pr_ventilationGHGImpactLblCO2e = pr_ventilation * pr_gwp; //J8
  let pr_refillingGHGImpactLblCO2e = pr_refilling * pr_gwp; //J9
  let pr_totalGHGImpactLblCO2e = pr_pumpOutGHGImpactLblCO2e + pr_ventilationGHGImpactLblCO2e + pr_refillingGHGImpactLblCO2e; //J10
  
  let pr_pumpOutGHGImpactLbltCO2e = pr_pumpOutGHGImpactLblCO2e / (pa_massConversion * 1000); //K7
  let pr_ventilationGHGImpactLbltCO2e = pr_ventilationGHGImpactLblCO2e / (pa_massConversion * 1000); //K8
  let pr_refillingGHGImpactLbltCO2e = pr_refillingGHGImpactLblCO2e / (pa_massConversion * 1000); //K9
  let pr_totalGHGImpactLbltCO2e = pr_pumpOutGHGImpactLbltCO2e + pr_ventilationGHGImpactLbltCO2e + pr_refillingGHGImpactLbltCO2e; //K10
  
  let pr_pumpOutGHGImpactPercent = pr_pumpOutGHGImpactLbltCO2e / pr_totalGHGImpactLbltCO2e;
  let pr_ventilationGHGImpactPercent = pr_ventilationGHGImpactLbltCO2e / pr_totalGHGImpactLbltCO2e;
  let pr_refillingGHGImpactPercent = pr_refillingGHGImpactLbltCO2e / pr_totalGHGImpactLbltCO2e;
  

  let pr_totalGHGImpactPercent = pr_pumpOutGHGImpactPercent + pr_ventilationGHGImpactPercent + pr_refillingGHGImpactPercent;

  
  function formatDecimals(num, places = 2){
    return new Intl.NumberFormat('en-IN', { style: 'decimal', useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: [places] }).format(num);
  }

  document.getElementById('pumoutTotalEmissions').innerText = formatDecimals(pr_pumpoutTotalEmissions, 0);
  document.getElementById('pumpOutGHGImpactLblCO2e').innerText = formatDecimals(pr_pumpOutGHGImpactLblCO2e, 0);
  document.getElementById('pumpOutGHGImpactLbltCO2e').innerText = formatDecimals(pr_pumpOutGHGImpactLbltCO2e);

  document.getElementById('ventilation').innerText = formatDecimals(pr_ventilation, 0);
  document.getElementById('ventilationGHGImpactLblCO2e').innerText = formatDecimals(pr_ventilationGHGImpactLblCO2e, 0);
  document.getElementById('ventilationGHGImpactLbltCO2e').innerText = formatDecimals(pr_ventilationGHGImpactLbltCO2e);

  document.getElementById('refilling').innerText = formatDecimals(pr_refilling, 0);
  document.getElementById('refillingGHGImpactLblCO2e').innerText = formatDecimals(pr_refillingGHGImpactLblCO2e, 0);
  document.getElementById('refillingGHGImpactLbltCO2e').innerText = formatDecimals(pr_refillingGHGImpactLbltCO2e);

  document.getElementById('totalEmissions').innerText = formatDecimals(pr_totalEmissions, 0);
  document.getElementById('totalGHGImpactLblCO2e').innerText = formatDecimals(pr_totalGHGImpactLblCO2e, 0);
  document.getElementById('totalGHGImpactLbltCO2e').innerText = formatDecimals(pr_totalGHGImpactLbltCO2e, 0);

  document.getElementById('pumpOutGHGImpactPercent').innerText = Math.round(pr_pumpOutGHGImpactPercent * 100) + "%";
  document.getElementById('ventilationGHGImpactPercent').innerText = Math.round(pr_ventilationGHGImpactPercent * 100) + "%";
  document.getElementById('refillingGHGImpactPercent').innerText = Math.round(pr_refillingGHGImpactPercent * 100) + "%";

  document.getElementById('totalGHGImpactPercent').innerText = Math.round(pr_totalGHGImpactPercent * 100) + "%";
}
