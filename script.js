document.addEventListener('DOMContentLoaded', () => {

    // #region GAME DATA
    const gameData = {
        generators: {
            probe: { name: "Probe", desc: "Autonomously scans for energy.", resource: 'energy', baseCost: 10, costGrowth: 1.12, baseProd: 0.1 },
            drone: { name: "Drone Swarm", desc: "Constructs small energy collectors.", resource: 'energy', baseCost: 150, costGrowth: 1.14, baseProd: 1 },
            factory: { name: "Stardust Factory", desc: "Synthesizes energy into valuable Stardust.", resource: 'stardust', baseCost: 2000, costGrowth: 1.16, baseProd: 0.5 },
            solarSatellite: { name: "Solar Satellite", desc: "Deploys orbital satellites that capture raw solar energy.", resource: 'energy', baseCost: 3000, costGrowth: 1.17, baseProd: 10 },
            starForge: { name: "Star Forge", desc: "Ignites small stars, generating immense energy.", resource: 'energy', baseCost: 25000, costGrowth: 1.18, baseProd: 50 },
            nebulaHarvester: { name: "Nebula Harvester", desc: "Gathers interstellar dust clouds.", resource: 'stardust', baseCost: 100000, costGrowth: 1.20, baseProd: 5 },
            blackHoleEvaporator: { name: "Black Hole Evaporator", desc: "Harnesses Hawking radiation for immense energy.", resource: 'energy', baseCost: 2.5e6, costGrowth: 1.22, baseProd: 2000 },
            quasarSiphon: { name: "Quasar Siphon", desc: "Draws matter from a galactic core to create Stardust.", resource: 'stardust', baseCost: 1e8, costGrowth: 1.24, baseProd: 250 },
            pulsarCollector: { name: "Pulsar Collector", desc: "Builds a collector array around a rapidly spinning neutron star.", resource: 'energy', baseCost: 1e9, costGrowth: 1.25, baseProd: 25000 },
            dysonSphere: { name: "Dyson Sphere", desc: "A megastructure encasing a star to capture its total energy output.", resource: 'energy', baseCost: 5e10, costGrowth: 1.26, baseProd: 150000 },
            galacticExchange: { name: "Galactic Exchange", desc: "Manages trade routes across an entire galaxy to accumulate rare materials.", resource: 'stardust', baseCost: 5e13, costGrowth: 1.28, baseProd: 10000 },
            cosmicStringWeaver: { name: "Cosmic String Weaver", desc: "Manipulates the vibrations of cosmic strings to release primal energy.", resource: 'energy', baseCost: 5e16, costGrowth: 1.30, baseProd: 2e6 },
            darkMatterReactor: { name: "Dark Matter Reactor", desc: "Annihilates dark matter particles to release staggering amounts of energy.", resource: 'energy', baseCost: 1e18, costGrowth: 1.31, baseProd: 5e7 },
            whiteHoleFountain: { name: "White Hole Fountain", desc: "A theoretical cosmic object that spews exotic matter, perfect for Stardust.", resource: 'stardust', baseCost: 5e19, costGrowth: 1.32, baseProd: 125000 },
            universeEmbryo: { name: "Universe Embryo", desc: "Nurtures a pocket universe, harvesting the energy from its formation.", resource: 'energy', baseCost: 1e22, costGrowth: 1.33, baseProd: 1e9 },
            multiverseConduit: { name: "Multiverse Conduit", desc: "Opens a stable wormhole to siphon energy from a higher-energy reality.", resource: 'energy', baseCost: 1e26, costGrowth: 1.34, baseProd: 5e10 },
            realityFabricator: { name: "Reality Fabricator", desc: "Rewrites the laws of physics in a localized area to generate energy from nothing.", resource: 'energy', baseCost: 1e31, costGrowth: 1.35, baseProd: 1e13 },
            finalSingularity: { name: "The Final Singularity", desc: "The ultimate energy source. It is all and everything.", resource: 'energy', baseCost: 1e37, costGrowth: 1.36, baseProd: 5e15 }
        },
        research: {
            r1: { name: "Improved Probes", desc: "Probe energy output x2.", cost: 10, dependencies: [], effect: { type: 'generator', target: 'probe', multiplier: 2 } },
            r5: { name: "Forge Focus", desc: "Manual forging generates +100% more Energy.", cost: 25, dependencies: ['r1'], effect: { type: 'click', multiplier: 2 } },
            r2: { name: "Self-Replication", desc: "Probe energy output x2.", cost: 50, dependencies: ['r1'], effect: { type: 'generator', target: 'probe', multiplier: 2 } },
            r3: { name: "Drone Optimization", desc: "Drone Swarm energy output x2.", cost: 100, dependencies: ['r1'], effect: { type: 'generator', target: 'drone', multiplier: 2 } },
            r8: { name: "High-Energy Forging", desc: "Doubles manual forging power again.", cost: 200, dependencies: ['r5'], effect: { type: 'click', multiplier: 2 } },
            r6: { name: "Stardust Catalysis", desc: "Each Stardust Factory boosts Drone Swarm production by 1%.", cost: 250, dependencies: ['r3'], effect: { type: 'synergy', source: 'factory', target: 'drone', bonus: 0.01 } },
            r4: { name: "Forge Amplification", desc: "Manual forging click power gains a bonus equal to 5% of your total Energy/sec.", cost: 500, dependencies: ['r2', 'r3'], effect: { type: 'click', target: 'bonus_from_eps' } },
            r11: { name: "Cosmic Resonance", desc: "All Energy production increased by 10%.", cost: 750, dependencies: ['r4'], effect: { type: 'global', target: 'energy', multiplier: 1.1 } },
            r7: { name: "Energy Condensation", desc: "Energy production is boosted by 5% for every Order of Magnitude of Stardust you have.", cost: 1000, dependencies: ['r4'], effect: { type: 'scaling_boost', source: 'stardust', target: 'energy', bonus: 0.05 } },
            r9: { name: "Forge Attunement", desc: "Each Drone Swarm you own adds +0.2 to your base click power.", cost: 1500, dependencies: ['r8', 'r11'], effect: { type: 'click_synergy', source: 'drone', bonus: 0.2 } },
            r12: { name: "Mass Drone Deployment", desc: "Drone Swarm production increased by 50%.", cost: 2000, dependencies: ['r6'], effect: { type: 'generator', target: 'drone', multiplier: 1.5 } },
            r10: { name: "Stardust Infusion", desc: "Clicks now generate Stardust equal to 0.1% of your Stardust/sec.", cost: 5000, dependencies: ['r7', 'r9'], effect: { type: 'click_bonus_resource' } },
            r13: { name: "Star Forge Optimization", desc: "Star Forge energy output x2.", cost: 10000, dependencies: ['r11'], effect: { type: 'generator', target: 'starForge', multiplier: 2 } },
            r14: { name: "Galactic Infrastructure", desc: "Probes and Drones gain +10% production for each unique generator type built.", cost: 25000, dependencies: ['r12'], effect: { type: 'synergy_unique_generators' } },
            r15: { name: "Nebula Compression", desc: "Nebula Harvester stardust output x2.", cost: 50000, dependencies: ['r13'], effect: { type: 'generator', target: 'nebulaHarvester', multiplier: 2 } },
            r16: { name: "Forge Star Synergy", desc: "Star Forges produce 0.5% more energy for each Drone Swarm you own.", cost: 125000, dependencies: ['r13', 'r14'], effect: { type: 'synergy', source: 'drone', target: 'starForge', bonus: 0.005 } },
            r17: { name: "Industrial Synthesis", desc: "All Stardust producers gain a 25% production boost.", cost: 250000, dependencies: ['r15'], effect: { type: 'class_boost', class: 'stardust' } },
            r18: { name: "Evaporation Catalysis", desc: "Black Hole Evaporator energy output x2.", cost: 500000, dependencies: ['r16'], effect: { type: 'generator', target: 'blackHoleEvaporator', multiplier: 2 } },
            r19: { name: "Quasar Lensing", desc: "Quasar Siphon stardust output x2.", cost: 1e6, dependencies: ['r17'], effect: { type: 'generator', target: 'quasarSiphon', multiplier: 2 } },
        },
        prisms: {
            // == TIER 1: BASICS ==
            p1: { name: "Dimensional Tear", desc: "Unlock the ability to generate Prisms passively.", cost: 0, dependencies: [], effect: { type: 'base_prism_unlock' }, position: { x: 50, y: 300 } },
            
            // == TIER 2: BRANCHING ==
            // Top: Research/Utility
            p2_top: { name: "Chronal Dilation", desc: "Stardust Research speed +25%.", cost: 2, dependencies: ['p1'], effect: { type: 'research_speed', value: 0.75 }, position: { x: 250, y: 150 } },
            // Mid: Production
            p2_mid: { name: "Prism Refraction", desc: "Double the base production of Prisms.", cost: 5, dependencies: ['p1'], effect: { type: 'prism_multiplier', value: 2 }, position: { x: 250, y: 300 } },
            // Bot: Reflection
            p2_bot: { name: "Energy Reflection", desc: "Boost ALL Energy production by 500% (x6).", cost: 8, dependencies: ['p1'], effect: { type: 'global_multiplier', target: 'energy', value: 6 }, position: { x: 250, y: 450 } },

            // == TIER 3 ==
            p3_top: { name: "Forge Synchronization", desc: "Manual forging is 2x more effective.", cost: 10, dependencies: ['p2_top'], effect: { type: 'click_boost', value: 2 }, position: { x: 450, y: 100 } },
            p3_top_2: { name: "Focused Chronometry", desc: "Stardust Research speed +30%.", cost: 15, dependencies: ['p2_top'], effect: { type: 'research_speed', value: 0.7 }, position: { x: 450, y: 200 } },
            
            p3_mid: { name: "Crystalline Focus", desc: "Triple the production of Prisms.", cost: 25, dependencies: ['p2_mid'], effect: { type: 'prism_multiplier', value: 3 }, position: { x: 450, y: 300 } },
            
            p3_bot: { name: "Stardust Reflection", desc: "Boost ALL Stardust production by 500% (x6).", cost: 12, dependencies: ['p2_bot'], effect: { type: 'global_multiplier', target: 'stardust', value: 6 }, position: { x: 450, y: 450 } },
            p3_bot_2: { name: "Nebula Resonance", desc: "Nebula Gas boost is 10% more effective.", cost: 20, dependencies: ['p2_bot'], effect: { type: 'nebula_efficiency', value: 1.1 }, position: { x: 450, y: 550 } },

            // == TIER 4 ==
            p4_top: { name: "Efficient Consumption", desc: "Consumables last 50% longer.", cost: 40, dependencies: ['p3_top_2'], effect: { type: 'consumable_duration', value: 1.5 }, position: { x: 650, y: 150 } },
            
            p4_mid_1: { name: "Energetic Resonance", desc: "Prism production boosted by Log10(Energy).", cost: 50, dependencies: ['p3_mid'], effect: { type: 'scaling_prism_prod', source: 'energy' }, position: { x: 650, y: 250 } },
            p4_mid_2: { name: "Material Resonance", desc: "Prism production boosted by Log10(Stardust).", cost: 50, dependencies: ['p3_mid'], effect: { type: 'scaling_prism_prod', source: 'stardust' }, position: { x: 650, y: 350 } },
            
            p4_bot: { name: "Cosmic Inflation", desc: "Gain +5% more Nebula Gas on reset.", cost: 60, dependencies: ['p3_bot_2'], effect: { type: 'prestige_boost', value: 1.05 }, position: { x: 650, y: 550 } },

            // == TIER 5 ==
            p5_uni: { name: "Universal Echo", desc: "All Energy and Stardust production x50.", cost: 200, dependencies: ['p4_mid_1', 'p4_mid_2'], effect: { type: 'global_multiplier', target: 'all', value: 50 }, position: { x: 850, y: 300 } },
            
            // New Tier 5 Side
            p5_side: { name: "Crystal Matrix", desc: "Energy production boosted by Log10(Stardust).", cost: 350, dependencies: ['p4_mid_2', 'p5_uni'], effect: { type: 'scaling_boost', source: 'stardust', target: 'energy', bonus: 0.1 }, position: { x: 850, y: 450 } },

            // == TIER 6 ==
            p6_top: { name: "Causal Manipulation", desc: "Research is instant (100% speed boost logic applied differently).", desc_long: "Research speed x10.", cost: 300, dependencies: ['p5_uni', 'p4_top'], effect: { type: 'research_speed', value: 0.1 }, position: { x: 1050, y: 150 } },
            
            p6_mid: { name: "Prism Singularity", desc: "Prism production x5.", cost: 500, dependencies: ['p5_uni'], effect: { type: 'prism_multiplier', value: 5 }, position: { x: 1050, y: 300 } },
            
            p6_bot: { name: "Event Horizon", desc: "Black Hole Evaporators are 2x stronger.", cost: 250, dependencies: ['p5_uni'], effect: { type: 'generator_boost', target: 'blackHoleEvaporator', value: 2 }, position: { x: 1050, y: 450 } },

            // New Tier 6 Side
            p6_ultra: { name: "Prism Saturation", desc: "Prism production is boosted by 1% per unspent Prism.", cost: 750, dependencies: ['p6_mid'], effect: { type: 'prism_saturation' }, position: { x: 1050, y: 600 } },

            // == TIER 7 (Endgame) ==
            p7_click: { name: "Hand of God", desc: "Clicking produces 10s of production.", cost: 1000, dependencies: ['p6_top'], effect: { type: 'click_time_warp', value: 10 }, position: { x: 1250, y: 100 } },
            
            p7_mid: { name: "Gemini Protocol", desc: "Passive Prism generation is boosted by Prism count.", cost: 2000, dependencies: ['p6_mid'], effect: { type: 'prism_self_boost' }, position: { x: 1250, y: 300 } },
            
            p7_bot: { name: "Big Crunch", desc: "Nebula Gas gain on reset is squared.", cost: 5000, dependencies: ['p6_bot', 'p4_bot'], effect: { type: 'prestige_exponent', value: 2 }, position: { x: 1250, y: 550 } },
            
            // New Tier 7 Side
            p7_deep: { name: "Deep Space Echo", desc: "Boost Energy production based on total playtime.", cost: 3000, dependencies: ['p7_mid'], effect: { type: 'playtime_boost' }, position: { x: 1250, y: 420 } },

            // == TIER 8 (Ultra) ==
            p8_final: { name: "Ascension", desc: "Unlock a permanent 10x multiplier to everything per Tier owned.", cost: 10000, dependencies: ['p7_mid', 'p7_click', 'p7_bot'], effect: { type: 'tier_scaling_all' }, position: { x: 1500, y: 300 } },
            
            p8_void: { name: "Void Harness", desc: "Energy caps are removed (Soft cap pushed).", cost: 25000, dependencies: ['p8_final'], effect: { type: 'softcap_push' }, position: { x: 1700, y: 300 } },
            
            // New Tier 9 God Mode
            p9_god: { name: "The Architect", desc: "Multiply ALL production by 1000x.", cost: 1e6, dependencies: ['p8_void'], effect: { type: 'global_multiplier', target: 'all', value: 1000 }, position: { x: 1950, y: 300 } }
        },
        cosmicLaws: {
            cl1: { name: "Law of Attraction", desc: "All Energy production permanently increased by 25%.", cost: 1, effect: { type: 'global', target: 'energy', multiplier: 1.25 } },
            cl2: { name: "Law of Synthesis", desc: "All Stardust production permanently increased by 25%.", cost: 3, effect: { type: 'global', target: 'stardust', multiplier: 1.25 } },
            cl9: { name: "Primordial Nucleus", desc: "Start each run with your first Probe and first Drone Swarm free.", cost: 8, effect: { type: 'starter_pack' } },
            cl3: { name: "Primordial Spark", desc: "Manual forging gains a base of +1 Energy per Nebula Gas.", cost: 10, effect: { type: 'click', target: 'bonus_from_nebula' } },
            cl4: { name: "Cosmic Efficiency", desc: "All Generator costs are permanently reduced by 10%.", cost: 15, effect: { type: 'cost_reduction', amount: 0.9 } },
            cl10: { name: "Cosmic Enlightenment", desc: "All Stardust Research costs are permanently reduced by 20%.", cost: 20, effect: { type: 'research_cost_reduction', amount: 0.8 } },
            cl5: { name: "Stardust Gravity", desc: "Permanently gain +2% Stardust production for every Cosmic Law enacted.", cost: 25, effect: { type: 'scaling_law', bonus: 0.02 } },
            cl11: { name: "Persistent Knowledge", desc: "The 'Improved Probes' research is permanently unlocked.", cost: 35, effect: { type: 'persistent_research', target: 'r1' } },
            cl6: { name: "Law of Expansion", desc: "Gain 20% more Nebula Gas on all future Big Bangs.", cost: 50, effect: { type: 'prestige_gain', multiplier: 1.2 } },
            cl13: { name: "Galactic Commerce", desc: "Gain 1 Prism every time you perform a Big Bang.", cost: 100, effect: { type: 'prism_on_prestige', amount: 1 } },
            cl7: { name: "Law of Resonance", desc: "Generator production milestone bonus is increased from 2x to 5x.", cost: 150, effect: { type: 'milestone_bonus', amount: 5 } },
            cl8: { name: "Law of the Void", desc: "All generators produce 0.2% more for each Nebula Gas you own.", cost: 250, effect: { type: 'scaling_boost_nebula', bonus: 0.002 } },
            cl14: { name: "Temporal Flux", desc: "Stardust research is permanently 25% faster.", cost: 350, effect: { type: 'research_speed', multiplier: 0.75 } },
            cl12: { name: "Universal Synergy", desc: "All synergy effects from Research are 3x more powerful.", cost: 500, effect: { type: 'synergy_multiplier', amount: 3 } },
            cl15: { name: "Event Horizon", desc: "Black Hole Evaporators and Quasar Siphons are 100x more powerful.", cost: 1000, effect: { type: 'generator_boost_specific' } },
        },
        consumables: {
            c1: { name: "Energy Surge", desc: "Instantly gain 5 minutes of Energy production.", cost: 5e4, type: 'instant_prod', resource: 'energy', duration: 300 },
            c2: { name: "Stardust Cluster", desc: "Instantly gain 5 minutes of Stardust production.", cost: 2.5e5, type: 'instant_prod', resource: 'stardust', duration: 300 },
            c3: { name: "Cosmic Boom", desc: "All production boosted by +200% for 60 seconds.", cost: 25000, type: 'prod_boost', multiplier: 3, duration: 60 },
            c4: { name: "Forge Overcharge", desc: "Manual forging is 10x more powerful for 30 seconds.", cost: 50000, type: 'click_boost', multiplier: 10, duration: 30 },
            c5: { name: "Efficiency Catalyst", desc: "All generator costs are halved for 60 seconds.", cost: 1e6, type: 'cost_reduction', multiplier: 0.5, duration: 60 },
            c6: { name: "Research Inspiration", desc: "Your next Research purchase is free.", cost: 5e6, type: 'free_research' },
            c7: { name: "Temporal Anomaly", desc: "Instantly gain 1 hour of all production.", cost: 1e10, type: 'instant_prod_all', duration: 3600 },
            c8: { name: "Stardust Geyser", desc: "Instantly gain Stardust equal to 1% of your current Energy.", cost: 1e10, type: 'energy_to_stardust', ratio: 0.01 },
            c9: { name: "Universal Constant", desc: "All production boosted by +500% for 20 seconds.", cost: 1e12, type: 'prod_boost', multiplier: 6, duration: 20 },
            c10: { name: "Prestige Echo", desc: "Gain Nebula Gas equal to 1% of your current pending amount (min 1).", cost: 1e15, type: 'prestige_echo', ratio: 0.01 }
        },
        challenges: {
            ch1: {
                name: "Energy Purity",
                desc: "Reach 1e6 Energy without building any Stardust generators.",
                requirement: (state) => state.bigBangCount >= 1,
                reqDesc: "Requires 1 Big Bang.",
                goal: (state) => state.energy >= 1e6,
                rewardDesc: "Your two cheapest generator types have their production permanently multiplied by 10.",
                effect: { type: 'challenge_boost_cheapest', count: 2, multiplier: 10 }
            },
            ch2: {
                name: "Manual Labor",
                desc: "Reach 1e7 Energy. Manual forging is 10x more powerful, but all generator production is multiplied by 0.2x.",
                requirement: (state) => state.bigBangCount >= 2,
                reqDesc: "Requires 2 Big Bangs.",
                goal: (state) => state.energy >= 1e7,
                rewardDesc: "Manual forging power is permanently multiplied by 25.",
                effect: { type: 'challenge_boost_click', multiplier: 25 }
            },
            ch3: {
                name: "Stardust Rush",
                desc: "Reach 5e3 Stardust. You cannot build Probes or Drone Swarms.",
                requirement: (state) => state.bigBangCount >= 3,
                reqDesc: "Requires 3 Big Bangs.",
                goal: (state) => state.stardust >= 5e3,
                rewardDesc: "All Stardust generator production is permanently multiplied by 5.",
                effect: { type: 'challenge_boost_class', class: 'stardust', multiplier: 5 }
            },
            ch4: {
                name: "Cosmic Sprint",
                desc: "Reach 1e10 total Energy generated in this run within 10 minutes.",
                requirement: (state) => state.bigBangCount >= 5,
                reqDesc: "Requires 5 Big Bangs.",
                goal: (state) => state.stats.totalEnergy >= 1e10 && (Date.now() - state.stats.runStartTime) <= 600000,
                rewardDesc: "All Energy and Stardust production is permanently increased by 100% (x2).",
                effect: { type: 'challenge_boost_global', multiplier: 2 }
            },
            ch5: {
                name: "Singularity",
                desc: "Reach 1e18 Energy using only a single type of generator.",
                requirement: (state) => state.bigBangCount >= 8,
                reqDesc: "Requires 8 Big Bangs.",
                goal: (state) => state.energy >= 1e18,
                rewardDesc: "All generator production is permanently boosted by 1.5% for each unspent Nebula Gas you have (compounding).",
                effect: { type: 'challenge_boost_scaling_nebula' }
            }
        },
        tiers: {
            1: { cost: 5e9, desc: "[OP] Research is 5x faster, Probes and Drones are 100x stronger, and you passively gain Stardust equal to 0.1% of your Energy/sec." },
            2: { cost: 5e15, desc: "All generator production is multiplied by your current Tier number." },
            3: { cost: 5e24, desc: "[OP] Generator milestone bonuses are squared, and all production is multiplied by your total Big Bangs (min 1x)." },
            4: { cost: 5e36, desc: "Gain 200% more Nebula Gas from all future Big Bangs (x3 total)." },
            5: { cost: 5e50, desc: "[OP] The production bonus from Nebula Gas is now exponential instead of linear (1.05^Gas)." },
            6: { cost: 5e65, desc: "All generator costs are permanently reduced by 10% for each Tier you have." },
            7: { cost: 5e80, desc: "All Stardust production is multiplied by 1.5 for each Tier you have (compounding)." },
            8: { cost: 5e100, desc: "Manual forging power gains a bonus from your total Stardust (multiplied by Stardust^0.05)." },
            9: { cost: 5e125, desc: "The effects of Cosmic Laws are 50% more powerful." },
            10: { cost: 5e155, desc: "[OP] All final Energy and Stardust production is raised to the power of 1.02, and the effects of completed Challenges are squared." }
        },
        milestones: [10, 25, 50, 100, 150, 200],
        milestoneMultiplier: 2
    };
    // #endregion

    // #region GAME STATE & SETUP
    const TICK_RATE = 100;

    const defaultGameState = {
        energy: 0,
        stardust: 0,
        nebulaGas: 0,
        prisms: 0,
        bigBangCount: 0,
        currentTier: 0,
        notation: 'standard', // 'standard' or 'scientific'
        buyAmount: 1, // 1, 10, 'max'
        generators: {},
        research: {},
        purchasedPrisms: {},
        isPrismBoosting: false,
        researchState: {
            currentResearch: null,
            researchStartTime: 0,
            researchEndTime: 0
        },
        cosmicLaws: {},
        consumableState: {},
        activeChallenge: null,
        completedChallenges: {},
        tempBonuses: {
            prodMultiplier: 1,
            clickMultiplier: 1,
            costMultiplier: 1,
            isNextResearchFree: false,
        },
        stats: {
            totalEnergy: 0,
            runStartTime: Date.now()
        },
        lastUpdate: Date.now()
    };
    
    function validateAndRepairGameState(state) {
        if (!state || typeof state !== 'object') {
            return JSON.parse(JSON.stringify(defaultGameState));
        }
        try {
            state.energy = (typeof state.energy === 'number' && isFinite(state.energy)) ? state.energy : 0;
            state.stardust = (typeof state.stardust === 'number' && isFinite(state.stardust)) ? state.stardust : 0;
            state.nebulaGas = (typeof state.nebulaGas === 'number' && isFinite(state.nebulaGas)) ? state.nebulaGas : 0;
            state.prisms = (typeof state.prisms === 'number' && isFinite(state.prisms)) ? state.prisms : 0;
            state.bigBangCount = state.bigBangCount || 0;
            state.currentTier = state.currentTier || 0;
            state.notation = state.notation || 'standard';
            state.buyAmount = state.buyAmount || 1;
            state.generators = (typeof state.generators === 'object' && state.generators !== null) ? state.generators : {};
            state.research = state.research || {};
            state.purchasedPrisms = state.purchasedPrisms || {};
            state.isPrismBoosting = false; 
            state.researchState = state.researchState || JSON.parse(JSON.stringify(defaultGameState.researchState));
            state.cosmicLaws = state.cosmicLaws || {};
            state.consumableState = state.consumableState || {};
            state.activeChallenge = state.activeChallenge || null;
            state.completedChallenges = state.completedChallenges || {};
            state.stats = state.stats || { totalEnergy: 0, runStartTime: Date.now() };
            state.stats.totalEnergy = (typeof state.stats.totalEnergy === 'number' && isFinite(state.stats.totalEnergy)) ? state.stats.totalEnergy : state.energy;
            state.lastUpdate = state.lastUpdate || Date.now();
            state.tempBonuses = state.tempBonuses || JSON.parse(JSON.stringify(defaultGameState.tempBonuses));
            return state;
        } catch (error) {
            console.error("Critical error repairing save. Reverting to default.", error);
            return JSON.parse(JSON.stringify(defaultGameState));
        }
    }
    
    function loadGame() {
        const savedGame = localStorage.getItem('cosmicForgeSave');
        if (savedGame) {
            try {
                const parsedState = JSON.parse(savedGame);
                return validateAndRepairGameState(parsedState);
            } catch (error) {
                console.error("Failed to parse save file. Starting a new game.", error);
                return JSON.parse(JSON.stringify(defaultGameState));
            }
        }
        return JSON.parse(JSON.stringify(defaultGameState));
    }

    let gameState = loadGame();

    const dom = {
        energy: document.getElementById('energy-display'),
        energyPs: document.getElementById('energy-ps-display'),
        stardust: document.getElementById('stardust-display'),
        stardustPs: document.getElementById('stardust-ps-display'),
        nebulaGas: document.getElementById('nebula-gas-display'),
        nebulaGasBoost: document.getElementById('nebula-gas-boost-display'),
        prisms: document.getElementById('prisms-display'),
        prismsPs: document.getElementById('prisms-ps-display'),
        forgeClickValue: document.getElementById('forge-click-value'),
        forgeButton: document.getElementById('forge-button'),
        logMessages: document.getElementById('log-messages'),
        generatorsContent: document.getElementById('generators-list'),
        researchTree: document.getElementById('research-tree'),
        prismTreeContainer: document.getElementById('prism-tree-container'),
        consumablesContainer: document.getElementById('consumables-container'),
        challengesContainer: document.getElementById('challenges-container'),
        cosmicLawsContainer: document.getElementById('cosmic-laws-container'),
        prestigeGain: document.getElementById('prestige-gain-display'),
        prestigeButton: document.getElementById('prestige-button'),
        bigBangCount: document.getElementById('big-bang-count'),
        tierInfo: document.getElementById('tier-info'),
        researchProgressContainer: document.getElementById('research-progress-container'),
        researchProgressLabel: document.getElementById('research-progress-label'),
        researchProgressBar: document.getElementById('research-progress-bar-inner'),
        researchProgressTimer: document.getElementById('research-progress-timer'),
        challengeIndicator: document.getElementById('challenge-indicator'),
        settingsButton: document.getElementById('settings-button'),
        optionsModal: document.getElementById('options-modal'),
        optionsCloseButton: document.getElementById('options-close-button'),
        notationToggleButton: document.getElementById('notation-toggle-button'),
        particlesContainer: document.getElementById('particles-container'),
        buyControls: document.getElementById('buy-controls'),
        exitPrismViewBtn: document.getElementById('exit-prism-view')
    };
    // #endregion

    // #region CORE ENGINE

    function calculateProduction() {
        let prod = { energy: 0, stardust: 0, prisms: 0, click: 1 };
        let multipliers = {
            global: { energy: 1, stardust: 1 },
            generators: {}
        };
        const tier = gameState.currentTier;

        for (const id in gameData.generators) { multipliers.generators[id] = 1; }

        // --- Prism Upgrade Effects ---
        for (const id in gameState.purchasedPrisms) {
            const prismTech = gameData.prisms[id];
            if (!prismTech) continue;
            const effect = prismTech.effect;
            switch(effect.type) {
                case 'global_multiplier':
                    if (effect.target === 'energy' || effect.target === 'all') multipliers.global.energy *= effect.value;
                    if (effect.target === 'stardust' || effect.target === 'all') multipliers.global.stardust *= effect.value;
                    break;
                case 'click_boost':
                    prod.click *= effect.value;
                    break;
                case 'generator_boost':
                     if (multipliers.generators[effect.target]) multipliers.generators[effect.target] *= effect.value;
                     break;
                case 'tier_scaling_all':
                    const tierBoost = Math.max(1, Math.pow(10, gameState.currentTier));
                    multipliers.global.energy *= tierBoost;
                    multipliers.global.stardust *= tierBoost;
                    break;
                case 'scaling_boost':
                    // Used for new upgrades (e.g. p5_side)
                     const sourceValue = gameState[effect.source];
                     if (sourceValue > 10) {
                         // Simple scaling for production
                         if (effect.target === 'energy') multipliers.global.energy *= (1 + Math.log10(sourceValue) * effect.bonus);
                         if (effect.target === 'stardust') multipliers.global.stardust *= (1 + Math.log10(sourceValue) * effect.bonus);
                     }
                    break;
                case 'playtime_boost':
                    // p7_deep
                    const minutesPlayed = (Date.now() - gameState.stats.runStartTime) / 60000;
                    multipliers.global.energy *= (1 + (minutesPlayed * 0.1));
                    break;
            }
        }

        // --- Tier Effects ---
        if (tier >= 1) {
            multipliers.generators.probe *= 100;
            multipliers.generators.drone *= 100;
        }
        if (tier >= 2) {
            const tierMultiplier = Math.max(1, tier);
            multipliers.global.energy *= tierMultiplier;
            multipliers.global.stardust *= tierMultiplier;
        }
        if (tier >= 3) {
            const bigBangMultiplier = Math.max(1, gameState.bigBangCount);
            multipliers.global.energy *= bigBangMultiplier;
            multipliers.global.stardust *= bigBangMultiplier;
        }
        if (tier >= 7) {
            multipliers.global.stardust *= Math.pow(1.5, tier);
        }

        // --- ACTIVE Challenge Effects ---
        if (gameState.activeChallenge === 'ch2') {
            prod.click *= 10;
            multipliers.global.energy *= 0.2;
            multipliers.global.stardust *= 0.2;
        }

        // --- PERMANENT Challenge Reward Effects ---
        for (const id in gameState.completedChallenges) {
            const challenge = gameData.challenges[id];
            const effect = challenge.effect;
            let effectMultiplier = effect.multiplier;
            if (tier >= 10) {
                 if (effectMultiplier) effectMultiplier = Math.pow(effectMultiplier, 2);
            }

            switch(effect.type) {
                case 'challenge_boost_cheapest':
                    const sortedGens = Object.keys(gameData.generators).sort((a,b) => gameData.generators[a].baseCost - gameData.generators[b].baseCost);
                    for(let i = 0; i < effect.count; i++) {
                        if (sortedGens[i]) {
                           multipliers.generators[sortedGens[i]] *= effect.multiplier;
                        }
                    }
                    break;
                case 'challenge_boost_click':
                    prod.click *= effectMultiplier;
                    break;
                case 'challenge_boost_class':
                    for(const genId in gameData.generators) {
                        if (gameData.generators[genId].resource === effect.class) {
                            multipliers.generators[genId] *= effectMultiplier;
                        }
                    }
                    break;
                case 'challenge_boost_global':
                    multipliers.global.energy *= effectMultiplier;
                    multipliers.global.stardust *= effectMultiplier;
                    break;
                case 'challenge_boost_scaling_nebula':
                    let nebulaBase = 1.015;
                    if (tier >= 10) nebulaBase = Math.pow(nebulaBase, 2); 
                    const nebulaPower = Math.pow(nebulaBase, gameState.nebulaGas);
                    multipliers.global.energy *= nebulaPower;
                    multipliers.global.stardust *= nebulaPower;
                    break;
            }
        }

        // --- Nebula Gas Bonus ---
        let nebulaEfficiency = 1;
         if (gameState.purchasedPrisms['p3_bot_2']) {
             nebulaEfficiency = 1.1; // 10% more effective
         }

        let nebulaBoost;
        if (tier >= 5) {
            nebulaBoost = Math.pow(1.05 * nebulaEfficiency, gameState.nebulaGas);
        } else {
            nebulaBoost = 1 + (gameState.nebulaGas * 0.01 * nebulaEfficiency);
        }
        multipliers.global.energy *= nebulaBoost;
        multipliers.global.stardust *= nebulaBoost;


        const lawEffectiveness = (tier >= 9) ? 1.5 : 1;
        const purchasedLawsCount = Object.keys(gameState.cosmicLaws).length;

        if (gameState.cosmicLaws['cl1']) { multipliers.global.energy *= (1 + (gameData.cosmicLaws.cl1.effect.multiplier - 1) * lawEffectiveness); }
        if (gameState.cosmicLaws['cl2']) { multipliers.global.stardust *= (1 + (gameData.cosmicLaws.cl2.effect.multiplier - 1) * lawEffectiveness); }

        if (gameState.cosmicLaws['cl8']) {
            const voidBoost = 1 + (gameState.nebulaGas * gameData.cosmicLaws.cl8.effect.bonus * lawEffectiveness);
            multipliers.global.energy *= voidBoost;
            multipliers.global.stardust *= voidBoost;
        }
        
        if (gameState.cosmicLaws['cl15']) {
            multipliers.generators.blackHoleEvaporator *= (1 + (100 - 1) * lawEffectiveness);
            multipliers.generators.quasarSiphon *= (1 + (100 - 1) * lawEffectiveness);
        }

        if (gameState.cosmicLaws['cl5'] && purchasedLawsCount > 0) {
            multipliers.global.stardust *= 1 + (purchasedLawsCount * gameData.cosmicLaws.cl5.effect.bonus * lawEffectiveness);
        }
        
        for (const id in gameState.research) {
            const tech = gameData.research[id];
            if (tech.effect.type === 'generator') {
                multipliers.generators[tech.effect.target] *= tech.effect.multiplier;
            } else if (tech.effect.type === 'click' && tech.effect.multiplier) {
                prod.click *= tech.effect.multiplier;
            } else if (tech.effect.type === 'global') {
                multipliers.global[tech.effect.target] *= tech.effect.multiplier;
            } else if (tech.effect.type === 'class_boost' && tech.effect.class === 'stardust') {
                multipliers.generators.factory *= 1.25;
                multipliers.generators.nebulaHarvester *= 1.25;
                multipliers.generators.quasarSiphon *= 1.25;
                multipliers.generators.galacticExchange *= 1.25; 
                multipliers.generators.whiteHoleFountain *= 1.25;
            }
        }

        const synergyMultiplier = gameState.cosmicLaws['cl12'] ? (1 + (gameData.cosmicLaws.cl12.effect.amount - 1) * lawEffectiveness) : 1;
        
        if (gameState.research['r6']) {
            const factoryCount = gameState.generators.factory?.count || 0;
            multipliers.generators.drone *= 1 + (factoryCount * 0.01 * synergyMultiplier);
        }
        if (gameState.research['r16']) {
            const droneCount = gameState.generators.drone?.count || 0;
            multipliers.generators.starForge *= 1 + (droneCount * 0.005 * synergyMultiplier);
        }
        if (gameState.research['r14']) {
            const uniqueTypes = Object.keys(gameState.generators).filter(id => gameState.generators[id] && gameState.generators[id].count > 0).length;
            const bonus = 1 + (uniqueTypes * 0.10 * synergyMultiplier);
            multipliers.generators.probe *= bonus;
            multipliers.generators.drone *= bonus;
        }

        // Calculate base generator production
        for (const id in gameData.generators) {
            const generator = gameData.generators[id];
            const state = gameState.generators[id] || { count: 0 };
            
            let currentMilestoneBonus = gameState.cosmicLaws['cl7'] ? (1 + (gameData.cosmicLaws.cl7.effect.amount - 1) * lawEffectiveness) : gameData.milestoneMultiplier;
            if (tier >= 3) {
                currentMilestoneBonus = Math.pow(currentMilestoneBonus, 2);
            }
            let milestoneMultiplier = 1;
            gameData.milestones.forEach(m => {
                if (state.count >= m) { milestoneMultiplier *= currentMilestoneBonus; }
            });
            
            const totalProd = state.count * generator.baseProd * multipliers.generators[id] * milestoneMultiplier;
            prod[generator.resource] += totalProd;
        }
        
        // --- Calculate Prism Production ---
        if (gameState.purchasedPrisms['p1']) {
            let prismBaseProd = 1 / 30; // 1 every 30 seconds
            let prismMultiplier = 1;
            for (const id in gameState.purchasedPrisms) {
                const prismTech = gameData.prisms[id];
                if (!prismTech) continue;
                const effect = prismTech.effect;
                if (effect.type === 'prism_multiplier') {
                    prismMultiplier *= effect.value;
                }
                 if (effect.type === 'scaling_prism_prod') {
                    const sourceValue = gameState[effect.source];
                    if (sourceValue > 10) {
                         const scalingBonus = 1 + Math.log10(sourceValue) * 0.25; 
                         prismMultiplier *= scalingBonus;
                    }
                }
                if (effect.type === 'prism_self_boost') {
                    prismMultiplier *= (1 + (gameState.prisms * 0.01));
                }
                if (effect.type === 'prism_saturation') {
                    // New p6_ultra effect
                    prismMultiplier *= (1 + (gameState.prisms * 0.01)); 
                }
            }
            prod.prisms = prismBaseProd * prismMultiplier;
            if (gameState.isPrismBoosting) {
                prod.prisms *= 9; // 3x gain, 3x speed
            }
        }
        

        // Apply global bonuses
        prod.energy *= multipliers.global.energy * gameState.tempBonuses.prodMultiplier;
        prod.stardust *= multipliers.global.stardust * gameState.tempBonuses.prodMultiplier;

        if (gameState.research['r7']) {
            const ordersOfMagnitude = Math.max(0, Math.floor(Math.log10(gameState.stardust)));
            if (isFinite(ordersOfMagnitude)) {
                 prod.energy *= 1 + (ordersOfMagnitude * 0.05);
            }
        }
        if (tier >= 1) { // Tier 1 passive stardust
            prod.stardust += prod.energy * 0.001;
        }

        prod.click *= gameState.tempBonuses.clickMultiplier;

        if (gameState.research['r9']) {
             const droneCount = gameState.generators.drone?.count || 0;
             prod.click += droneCount * 0.2;
        }
        if (gameState.research['r4']) {
            prod.click += prod.energy * 0.05;
        }
        if (tier >= 8 && gameState.stardust > 1) {
            prod.click *= Math.pow(gameState.stardust, 0.05);
        }
        if (gameState.cosmicLaws['cl3']) {
            prod.click += gameState.nebulaGas;
        }
        
        // Special Click effect
        if(gameState.purchasedPrisms['p7_click']) {
            // Hand of God: Click = 10s of production
            prod.click += prod.energy * 10;
        }

        if (tier >= 10) {
            if (prod.energy > 1) prod.energy = Math.pow(prod.energy, 1.02);
            if (prod.stardust > 1) prod.stardust = Math.pow(prod.stardust, 1.02);
        }

        return prod;
    }

    function gameTick() {
        const now = Date.now();
        const delta = (now - gameState.lastUpdate) / 1000;

        if (gameState.researchState.currentResearch && now >= gameState.researchState.researchEndTime) {
            completeResearch();
        }

        if (gameState.activeChallenge) {
            if (gameData.challenges[gameState.activeChallenge].goal(gameState)) {
                completeChallenge();
            }
            if (gameState.activeChallenge === 'ch4' && (now - gameState.stats.runStartTime) > 600000) {
                addLogMessage(`Challenge Failed: Cosmic Sprint time limit exceeded.`, 'danger');
                abandonChallenge(false);
            }
        }

        const production = calculateProduction();
        gameState.energy += production.energy * delta;
        gameState.stats.totalEnergy += production.energy * delta;
        gameState.stardust += production.stardust * delta;
        gameState.prisms += production.prisms * delta;
        gameState.lastUpdate = now;

        updateUI(production);
    }

    // #endregion

    // #region UI RENDERING

    function updateUI(production) {
        dom.energy.textContent = formatNumber(gameState.energy);
        dom.energyPs.textContent = `(+${formatNumber(production.energy)}/s)`;
        dom.stardust.textContent = formatNumber(gameState.stardust);
        dom.stardustPs.textContent = `(+${formatNumber(production.stardust)}/s)`;
        dom.nebulaGas.textContent = formatNumber(gameState.nebulaGas, true);
        dom.nebulaGasBoost.textContent = `(+${(gameState.nebulaGas).toFixed(0)}% boost)`;
        dom.prisms.textContent = formatNumber(gameState.prisms);
        dom.prismsPs.textContent = `(+${formatNumber(production.prisms)}/s)`;
        dom.forgeClickValue.textContent = `+${formatNumber(production.click)} Energy`;

        // Update Generator Buttons without rebuilding DOM (Fixes Click Issue)
        for (const id in gameData.generators) {
            const btn = document.querySelector(`#${id} .buy-button`);
            if (btn) {
                const state = gameState.generators[id] || { count: 0 };
                const calc = calculateBulkCost(id, state.count, gameState.buyAmount);
                const affordable = gameState.energy >= calc.cost;
                
                if (btn.disabled !== !affordable) btn.disabled = !affordable;
                
                let btnText = gameState.buyAmount === 'max' ? `Max (${calc.amount})` : `Buy ${calc.amount}`;
                // Only update innerHTML if text/cost changes to prevent layout thrashing
                const newHTML = `${btnText}<br><span class="item-cost">${formatNumber(calc.cost)}</span> Energy`;
                if(btn.innerHTML !== newHTML) btn.innerHTML = newHTML;
                
                // Update count
                const countDiv = document.querySelector(`#${id} .item-count`);
                if(countDiv && countDiv.textContent != state.count) countDiv.textContent = state.count;
            }
        }
        
        // Update Research Buttons
        updateResearchUI();
        
        // Update Prism Tree Availability
        updatePrismTreeUI();

        // Update Consumables
        updateConsumablesUI();

        updateResearchProgressUI();
        updateChallengeIndicator();
        
        // Only update these if visible/relevant
        if(document.getElementById('challenges-content').classList.contains('active')) renderChallenges(); 
        if(document.getElementById('cosmic-laws-container').offsetParent) renderCosmicLaws(); // Simple visibility check

        dom.bigBangCount.textContent = gameState.bigBangCount;
        const prestigeGain = calculatePrestigeGain();
        dom.prestigeGain.textContent = formatNumber(prestigeGain);
        dom.prestigeButton.disabled = prestigeGain < 1 || !!gameState.activeChallenge;
    }
    
    function renderAll() {
        initializeGenerators();
        initializeResearchTree();
        initializePrismTree();
        initializeConsumables();
        renderChallenges();
        renderTiers();
        renderCosmicLaws();
        updateBuyControls();
    }

    function initializeGenerators() {
        let html = '';
        const sortedGenerators = Object.keys(gameData.generators).sort((a, b) => gameData.generators[a].baseCost - gameData.generators[b].baseCost);

        for (const id of sortedGenerators) {
            const gen = gameData.generators[id];
            const state = gameState.generators[id] || { count: 0 };
            
            let milestoneHTML = '<div class="milestone-bar">';
            gameData.milestones.forEach(m => {
                milestoneHTML += `<div class="milestone-pip ${state.count >= m ? 'unlocked' : ''}"></div>`;
            });
            milestoneHTML += '</div>';

            html += `
                <div class="item" id="${id}">
                    <div class="item-info">
                        <div class="item-name">${gen.name}</div>
                        <div class="item-desc">${gen.desc}</div>
                        <div class="item-prod">Produces +${formatNumber(gen.baseProd)} ${gen.resource}/s each.</div>
                        ${milestoneHTML}
                    </div>
                    <div class="item-actions">
                        <div class="item-count">${state.count}</div>
                        <button class="buy-button" data-id="${id}">Loading...</button>
                    </div>
                </div>
            `;
        }
        dom.generatorsContent.innerHTML = html;
    }
    
    function updateBuyControls() {
        document.querySelectorAll('.buy-amt-btn').forEach(btn => {
            if (btn.dataset.amt == gameState.buyAmount) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function initializeResearchTree() {
        // Just build the structure, visual state handled in updateResearchUI
        let html = '';
        const sortedResearch = Object.keys(gameData.research).sort((a,b) => getResearchCost(a) - getResearchCost(b));

        for (const id of sortedResearch) {
            const tech = gameData.research[id];
            html += `
                <div class="tech" id="tech-${id}">
                    <div>${tech.name}</div>
                    <small>${tech.desc}</small>
                    <div class="tech-time"></div>
                    <button class="buy-button tech-button" data-id="${id}"></button>
                </div>
            `;
        }
        dom.researchTree.innerHTML = html;
        updateResearchUI(); // Initial state set
    }

    function updateResearchUI() {
        const sortedResearch = Object.keys(gameData.research).sort((a,b) => getResearchCost(a) - getResearchCost(b));
        const isResearching = gameState.researchState.currentResearch !== null;

        for (const id of sortedResearch) {
            const el = document.getElementById(`tech-${id}`);
            if(!el) continue;

            const tech = gameData.research[id];
            const cost = getResearchCost(id);
            const duration = calculateResearchTime(id) / 1000;
            const depsMet = tech.dependencies.every(dep => gameState.research[dep]);
            const isPurchased = !!gameState.research[id];

            // Handle visibility
            if (isPurchased) {
                el.className = "tech purchased";
                el.querySelector('.buy-button').textContent = "Purchased";
                el.querySelector('.buy-button').disabled = true;
                el.style.display = 'flex';
            } else if (depsMet) {
                el.className = "tech available";
                el.style.display = 'flex';
                const btn = el.querySelector('.buy-button');
                
                if (isResearching) {
                    if (gameState.researchState.currentResearch === id) {
                        btn.textContent = "Researching...";
                        btn.disabled = true;
                    } else {
                        btn.textContent = "Queue Blocked";
                        btn.disabled = true;
                    }
                } else {
                    const affordable = gameState.stardust >= cost;
                    btn.textContent = `Cost: ${formatNumber(cost)} SD`;
                    btn.disabled = !affordable;
                }
                el.querySelector('.tech-time').textContent = `Time: ${duration.toFixed(1)}s`;
            } else {
                el.style.display = 'none'; // Hide if deps not met
            }
        }
    }

    function initializePrismTree() {
        // Create canvas wrap
        dom.prismTreeContainer.innerHTML = '<div id="prism-canvas"></div>';
        const canvas = document.getElementById('prism-canvas');
        
        let html = '';
        let connectorsHtml = '';
    
        // Connectors
        for (const id in gameData.prisms) {
            const tech = gameData.prisms[id];
            for (const depId of tech.dependencies) {
                const depTech = gameData.prisms[depId];
                if (depTech) {
                    const startPos = depTech.position;
                    const endPos = tech.position;
                    
                    const nodeWidth = 140; 
                    const nodeHeight = 90;

                    const x1 = startPos.x + nodeWidth / 2;
                    const y1 = startPos.y + nodeHeight / 2;
                    const x2 = endPos.x + nodeWidth / 2;
                    const y2 = endPos.y + nodeHeight / 2;
    
                    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                    
                    connectorsHtml += `
                        <div class="prism-connector" id="conn-${depId}-${id}" style="
                            width: ${length}px;
                            left: ${x1}px;
                            top: ${y1}px;
                            transform: rotate(${angle}deg);
                        "></div>
                    `;
                }
            }
        }
    
        // Nodes
        for (const id in gameData.prisms) {
            const tech = gameData.prisms[id];
            html += `
                <div class="prism-tech" id="prism-${id}" data-id="${id}" style="left: ${tech.position.x}px; top: ${tech.position.y}px;">
                    <div class="prism-tech-name">${tech.name}</div>
                    <div class="prism-tech-desc">${tech.desc_long || tech.desc}</div>
                    <div class="prism-tech-cost"></div>
                </div>
            `;
        }
        
        canvas.innerHTML = connectorsHtml + html;
    }

    function updatePrismTreeUI() {
        for (const id in gameData.prisms) {
            const tech = gameData.prisms[id];
            const el = document.getElementById(`prism-${id}`);
            if(!el) continue;

            const isPurchased = !!gameState.purchasedPrisms[id];
            const depsMet = tech.dependencies.every(dep => gameState.purchasedPrisms[dep]);
            const canAfford = gameState.prisms >= tech.cost;
            const costDiv = el.querySelector('.prism-tech-cost');

            el.className = 'prism-tech'; // Reset
            if (isPurchased) {
                el.classList.add('purchased');
                costDiv.textContent = 'Owned';
            } else if (depsMet) {
                if (canAfford) el.classList.add('available');
                else el.classList.add('locked'); // Visible but can't afford
                costDiv.textContent = `Cost: ${formatNumber(tech.cost)} P`;
            } else {
                el.classList.add('locked');
                // Removed inline opacity set to allow CSS class control
                el.style.opacity = ''; 
                costDiv.textContent = 'Locked';
            }

            // Update connectors
            for (const depId of tech.dependencies) {
                const conn = document.getElementById(`conn-${depId}-${id}`);
                if(conn) {
                    if (gameState.purchasedPrisms[id] && gameState.purchasedPrisms[depId]) {
                        conn.classList.add('purchased');
                    } else {
                        conn.classList.remove('purchased');
                    }
                }
            }
        }
    }

    function updateResearchProgressUI() {
        if (!gameState.researchState.currentResearch) {
            dom.researchProgressContainer.style.display = 'none';
            return;
        }

        dom.researchProgressContainer.style.display = 'flex';
        const state = gameState.researchState;
        const techName = gameData.research[state.currentResearch].name;
        const now = Date.now();

        const totalDuration = state.researchEndTime - state.researchStartTime;
        const elapsedTime = now - state.researchStartTime;
        const progress = Math.min(100, (elapsedTime / totalDuration) * 100);
        
        const timeLeft = Math.max(0, state.researchEndTime - now) / 1000;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = Math.floor(timeLeft % 60);

        dom.researchProgressLabel.textContent = `Researching: ${techName}`;
        dom.researchProgressBar.style.width = `${progress}%`;
        dom.researchProgressTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function initializeConsumables() {
        let html = '';
        for (const id in gameData.consumables) {
            const item = gameData.consumables[id];
            html += `
                <div class="consumable-item" id="consumable-item-${id}">
                    <div class="consumable-info">
                        <div class="item-name">${item.name}</div>
                        <small>${item.desc}</small>
                    </div>
                    <div class="consumable-actions">
                        <div class="active-timer"></div>
                        <button class="buy-button consumable-button" data-id="${id}"></button>
                    </div>
                </div>
            `;
        }
        dom.consumablesContainer.innerHTML = html;
    }

    function updateConsumablesUI() {
        const now = Date.now();
        for (const id in gameData.consumables) {
            const item = gameData.consumables[id];
            const state = gameState.consumableState[id] || { cooldown: 0, activeUntil: 0 };
            const el = document.getElementById(`consumable-item-${id}`);
            if(!el) continue;

            const btn = el.querySelector('.consumable-button');
            const timerDiv = el.querySelector('.active-timer');
            
            const cooldownLeft = state.cooldown - now;
            const activeLeft = state.activeUntil - now;
            const isTimedBoost = item.type === 'prod_boost' || item.type === 'click_boost' || item.type === 'cost_reduction';

            // Boost duration logic (Prism upgrade p4_top)
            let durationMult = 1;
            if (gameState.purchasedPrisms['p4_top']) durationMult = 1.5;

            if (cooldownLeft > 0) {
                btn.disabled = true;
                btn.textContent = `Cooldown (${(cooldownLeft / 1000).toFixed(1)}s)`;
            } else if (isTimedBoost && activeLeft > 0) {
                btn.disabled = true;
                btn.textContent = "Active";
            } else {
                const affordable = gameState.energy >= item.cost;
                btn.disabled = !affordable;
                btn.textContent = `Cost: ${formatNumber(item.cost)}`;
            }

            if (activeLeft > 0) {
                timerDiv.textContent = `Active: ${(activeLeft / 1000).toFixed(1)}s`;
            } else {
                timerDiv.textContent = '';
            }
        }
    }
    
    function renderChallenges() {
        // Challenges update less frequently so rebuilding DOM is okay-ish, but let's be safe
        let html = '';
        for (const id in gameData.challenges) {
            const chal = gameData.challenges[id];
            const reqMet = chal.requirement(gameState);
            const isCompleted = !!gameState.completedChallenges[id];
            const isActive = gameState.activeChallenge === id;
            let classes = 'challenge-item';
            if (isCompleted) classes += ' completed';
            if (isActive) classes += ' active';
            if (!reqMet) classes += ' locked';

            let buttonHTML = '';
            if (isActive) {
                buttonHTML = `<button class="challenge-button danger" data-id="${id}" data-action="abandon">Abandon</button>`;
            } else if (!reqMet) {
                buttonHTML = `<button class="challenge-button" disabled>${chal.reqDesc}</button>`;
            } else if (!gameState.activeChallenge && !isCompleted) {
                buttonHTML = `<button class="challenge-button" data-id="${id}" data-action="start">Start</button>`;
            } else {
                buttonHTML = `<button class="challenge-button" disabled>${isCompleted ? 'Completed' : 'Challenge Active'}</button>`;
            }

            html += `
                <div class="${classes}" id="${id}">
                    <div class="item-name">${chal.name} ${isCompleted ? '(✓)' : ''}</div>
                    <small class="item-desc">${chal.desc}</small>
                    <div class="challenge-reward"><b>Reward:</b> ${chal.rewardDesc}</div>
                    ${buttonHTML}
                </div>
            `;
        }
        if(dom.challengesContainer.innerHTML !== html) dom.challengesContainer.innerHTML = html;
    }

    function updateChallengeIndicator() {
        if (gameState.activeChallenge) {
            const name = gameData.challenges[gameState.activeChallenge].name;
            dom.challengeIndicator.textContent = `Challenge Active: ${name}`;
            dom.challengeIndicator.style.display = 'block';
        } else {
            dom.challengeIndicator.style.display = 'none';
        }
    }

    function renderTiers() {
        const currentTier = gameState.currentTier;
        const nextTier = currentTier + 1;
        let html = `<h3>Current Tier: ${currentTier}</h3>`;

        if (nextTier > Object.keys(gameData.tiers).length) {
            html += `<p>You have reached the maximum Tier!</p>`;
        } else {
            const tierData = gameData.tiers[nextTier];
            const affordable = gameState.energy >= tierData.cost;
            html += `
                <div class="tier-info-box">
                    <h4>Next Tier: ${nextTier}</h4>
                    <p class="tier-desc">${tierData.desc}</p>
                    <button id="tier-up-button" class="prestige-button" ${affordable ? '' : 'disabled'}>
                        Cost: ${formatNumber(tierData.cost)} Energy
                    </button>
                </div>
            `;
        }
        if(dom.tierInfo.innerHTML !== html) dom.tierInfo.innerHTML = html;
    }


    function renderCosmicLaws() {
        let html = '';
        const purchasedLawsCount = Object.keys(gameState.cosmicLaws).length;
        const sortedLaws = Object.keys(gameData.cosmicLaws).sort((a,b) => gameData.cosmicLaws[a].cost - gameData.cosmicLaws[b].cost);

        for (const id of sortedLaws) {
            const law = gameData.cosmicLaws[id];
            let dynamicDesc = law.desc;

            switch(id) {
                case 'cl3':
                    dynamicDesc = `${law.desc} (Currently: +${formatNumber(gameState.nebulaGas, true)})`;
                    break;
                case 'cl5':
                    const lawsCount = purchasedLawsCount + (gameState.cosmicLaws[id] ? 0 : 1);
                    const gravityBonus = lawsCount * law.effect.bonus * 100;
                    dynamicDesc = `${law.desc} (Currently: +${gravityBonus.toFixed(0)}%)`;
                    break;
                case 'cl8':
                    const voidBonus = (gameState.nebulaGas * law.effect.bonus * 100);
                    dynamicDesc = `${law.desc} (Currently: +${formatNumber(voidBonus)}%)`;
                    break;
            }
            
            if(gameState.cosmicLaws[id]) {
                html += `<div class="tech purchased" id="${id}"><div>${law.name}</div><small>${dynamicDesc}</small></div>`;
            } else {
                 const affordable = gameState.nebulaGas >= law.cost;
                 html += `
                    <div class="tech available" id="${id}">
                        <div>${law.name}</div>
                        <small>${dynamicDesc}</small>
                        <button class="buy-button tech-button" data-id="${id}" ${affordable ? '' : 'disabled'}>
                            Cost: ${formatNumber(law.cost, true)} Nebula Gas
                        </button>
                    </div>
                `;
            }
        }
        if(dom.cosmicLawsContainer.innerHTML !== html) dom.cosmicLawsContainer.innerHTML = html;
    }

    function addLogMessage(message, type = 'normal') {
        const p = document.createElement('p');
        p.textContent = `> ${message}`;
        p.className = type;
        dom.logMessages.prepend(p);
        if (dom.logMessages.children.length > 20) {
            dom.logMessages.lastChild.remove();
        }
    }

    // #endregion

    // #region VISUALS
    function createClickParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random scatter
        const spread = 20;
        const destX = (Math.random() - 0.5) * spread * 10;
        const destY = (Math.random() - 0.5) * spread * 10;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.transform = `translate(${destX}px, ${destY}px)`;
        
        dom.particlesContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }

    function createFloatingText(x, y, text) {
        const el = document.createElement('div');
        el.textContent = text;
        el.classList.add('floating-text');
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        dom.particlesContainer.appendChild(el);
        setTimeout(() => el.remove(), 1000);
    }
    // #endregion

    // #region EVENT HANDLERS

    function setupEventListeners() {
        dom.forgeButton.addEventListener('click', (e) => {
            const prod = calculateProduction();
            gameState.energy += prod.click;
            gameState.stats.totalEnergy += prod.click;
            if (gameState.research['r10']) {
                gameState.stardust += prod.stardust * 0.001;
            }

            // Visuals
            const rect = dom.forgeButton.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            createFloatingText(centerX, rect.top, `+${formatNumber(prod.click)}`);
            for(let i=0; i<5; i++) {
                createClickParticle(centerX, centerY);
            }
        });

        dom.buyControls.addEventListener('click', (e) => {
            if(e.target.classList.contains('buy-amt-btn')) {
                gameState.buyAmount = e.target.dataset.amt === 'max' ? 'max' : parseInt(e.target.dataset.amt);
                updateBuyControls();
                updateUI(calculateProduction()); // Force refresh cost display
            }
        });

        dom.generatorsContent.addEventListener('click', (e) => {
            const btn = e.target.closest('.buy-button');
            if (btn) {
                buyGenerator(btn.dataset.id);
            }
        });
        
        dom.researchTree.addEventListener('click', (e) => {
             const btn = e.target.closest('.tech-button');
            if (btn) {
                buyResearch(btn.dataset.id);
            }
        });
        
        dom.prismTreeContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.prism-tech');
            if (target) {
                buyPrismUpgrade(target.dataset.id);
            }
        });

        const boostButton = document.getElementById('prism-boost-button');
        boostButton.addEventListener('mousedown', () => gameState.isPrismBoosting = true);
        boostButton.addEventListener('mouseup', () => gameState.isPrismBoosting = false);
        boostButton.addEventListener('mouseleave', () => gameState.isPrismBoosting = false); // In case mouse leaves while held
        boostButton.addEventListener('touchstart', (e) => { e.preventDefault(); gameState.isPrismBoosting = true; }, { passive: false });
        boostButton.addEventListener('touchend', (e) => { e.preventDefault(); gameState.isPrismBoosting = false; });
        boostButton.addEventListener('touchcancel', (e) => { e.preventDefault(); gameState.isPrismBoosting = false; });


        dom.consumablesContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.consumable-button');
            if (btn) {
                buyConsumable(btn.dataset.id);
            }
        });

        dom.challengesContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.challenge-button');
            if (btn) {
                const id = btn.dataset.id;
                const action = btn.dataset.action;
                if (action === 'start') {
                    startChallenge(id);
                } else if (action === 'abandon') {
                    abandonChallenge(true);
                }
            }
        });

        dom.tierInfo.addEventListener('click', (e) => {
            if (e.target.matches('#tier-up-button')) {
                buyTier();
            }
        });

        dom.cosmicLawsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.tech-button');
            if (btn) {
                buyCosmicLaw(btn.dataset.id);
            }
        });
        
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.dataset.tab;

                if (targetId === 'prisms') {
                    // Activate Prism Overlay Mode
                    // Fix: Hide other active content to prevent bleed-through/interaction issues behind the overlay
                    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
                    document.getElementById('prisms-content').classList.add('active');
                } else {
                    // Normal tab switching
                    const currentActive = document.querySelector('.tab-button.active');
                    if (currentActive) currentActive.classList.remove('active');
                    button.classList.add('active');
                    
                    const currentTab = document.querySelector('.tab-content.active');
                    if (currentTab) currentTab.classList.remove('active');
                    
                    // Explicitly hide prisms content if it was active
                    document.getElementById('prisms-content').classList.remove('active');
                    
                    const targetTabContent = document.getElementById(`${targetId}-content`);
                    if(targetTabContent) targetTabContent.classList.add('active');
                }
            });
        });

        // Close Prism View Button
        dom.exitPrismViewBtn.addEventListener('click', () => {
            document.getElementById('prisms-content').classList.remove('active');
            
            // Re-activate whatever tab button says is active (usually Generators or Research)
            const activeBtn = document.querySelector('.tab-button.active');
            if(activeBtn) {
                const targetContent = document.getElementById(`${activeBtn.dataset.tab}-content`);
                if(targetContent) targetContent.classList.add('active');
            } else {
                 // Default to generators if nothing is active
                 document.getElementById('generators-content').classList.add('active');
            }
        });

        dom.prestigeButton.addEventListener('click', performBigBang);
        
        // Options Modal Listeners
        dom.settingsButton.addEventListener('click', () => dom.optionsModal.classList.remove('hidden'));
        dom.optionsCloseButton.addEventListener('click', () => dom.optionsModal.classList.add('hidden'));
        dom.optionsModal.addEventListener('click', (e) => {
             if(e.target === dom.optionsModal) { // Close if clicking on the background
                dom.optionsModal.classList.add('hidden');
             }
        });
        document.getElementById('save-button').addEventListener('click', () => saveGame(true));
        document.getElementById('hard-reset-button').addEventListener('click', hardReset);
        dom.notationToggleButton.addEventListener('click', toggleNotation);
    }
    
    // #endregion

    // #region ACTIONS & HELPERS

    function getCostMultiplier() {
        let mult = gameState.tempBonuses.costMultiplier;
        if (gameState.cosmicLaws['cl4']) {
            mult *= gameData.cosmicLaws.cl4.effect.amount;
        }
        if (gameState.currentTier >= 6) {
            mult *= Math.pow(0.9, gameState.currentTier);
        }
        return mult;
    }

    // Calculates cost for ONE item at specific count
    function calculateSingleCost(genId, count) {
        const gen = gameData.generators[genId];
        const multiplier = getCostMultiplier();
        return Math.floor(gen.baseCost * Math.pow(gen.costGrowth, count) * multiplier);
    }

    // Calculates cost and amount for bulk buying
    function calculateBulkCost(genId, currentCount, buyMode) {
        const gen = gameData.generators[genId];
        const multiplier = getCostMultiplier();
        const baseCost = gen.baseCost;
        const growth = gen.costGrowth;
        
        if (buyMode === 1) {
            return {
                cost: Math.floor(baseCost * Math.pow(growth, currentCount) * multiplier),
                amount: 1
            };
        }

        if (buyMode === 10) {
            // Geometric series sum: a * (1 - r^n) / (1 - r)
            // First term (a) is cost of next item
            const firstTerm = baseCost * Math.pow(growth, currentCount);
            const sum = firstTerm * (1 - Math.pow(growth, 10)) / (1 - growth);
            return {
                cost: Math.floor(sum * multiplier),
                amount: 10
            };
        }

        if (buyMode === 'max') {
            // Max buy logic: derived from sum formula
            const effectiveEnergy = gameState.energy / multiplier;
            const costOfNext = baseCost * Math.pow(growth, currentCount);
            
            if (effectiveEnergy < costOfNext) {
                return { cost: Math.floor(costOfNext * multiplier), amount: 1 }; // Can't afford 1
            }

            // n = log_growth ( 1 + (energy * (growth - 1) / costOfNext) )
            const n = Math.floor(Math.log(1 + (effectiveEnergy * (growth - 1) / costOfNext)) / Math.log(growth));
            
            // Recalculate exact cost for n
            const exactSum = costOfNext * (Math.pow(growth, n) - 1) / (growth - 1);
            
            return {
                cost: Math.floor(exactSum * multiplier),
                amount: Math.max(1, n)
            };
        }
        
        return { cost: Infinity, amount: 0 };
    }

    function getResearchCost(techId) {
        const tech = gameData.research[techId];
        let costMultiplier = 1;
        if (gameState.cosmicLaws['cl10']) {
            costMultiplier *= gameData.cosmicLaws.cl10.effect.amount;
        }
        if (gameState.tempBonuses.isNextResearchFree) return 0;

        return tech.cost * costMultiplier;
    }

    function calculateResearchTime(techId) {
        const sortedResearch = Object.keys(gameData.research).sort((a,b) => gameData.research[a].cost - gameData.research[b].cost);
        const index = sortedResearch.indexOf(techId);
        const totalTechs = sortedResearch.length;
    
        const startTime = 1000; // 1 second
        const endTime = 300000; // 5 minutes (300,000 ms)
    
        const base = endTime / startTime;
        const exponent = index / (totalTechs - 1);
        let time = startTime * Math.pow(base, exponent);
    
        if (gameState.currentTier >= 1) {
            time /= 5;
        }

        // Apply prism upgrade effects
        let researchSpeedMultiplier = 1;
        if (gameState.cosmicLaws['cl14']) {
            researchSpeedMultiplier *= gameData.cosmicLaws.cl14.effect.multiplier;
        }
        for (const id in gameState.purchasedPrisms) {
            const prismTech = gameData.prisms[id];
            if (prismTech?.effect.type === 'research_speed') {
                // If value is small (0.x), it's a reduction. If 0.1, it's 10x speed.
                researchSpeedMultiplier *= prismTech.effect.value;
            }
        }
        time *= researchSpeedMultiplier;
    
        return time;
    }


    function buyGenerator(id) {
        if (gameState.activeChallenge === 'ch1' && gameData.generators[id].resource === 'stardust') {
            addLogMessage("Challenge restriction: Cannot build Stardust generators.", 'danger');
            return;
        }
        if (gameState.activeChallenge === 'ch3' && (id === 'probe' || id === 'drone')) {
            addLogMessage("Challenge restriction: Cannot build Probes or Drones.", 'danger');
            return;
        }
        if (gameState.activeChallenge === 'ch5') {
            const builtTypes = Object.keys(gameState.generators).filter(genId => gameState.generators[genId].count > 0);
            if (builtTypes.length > 0 && !builtTypes.includes(id)) {
                addLogMessage("Challenge restriction: Can only build one type of generator.", 'danger');
                return;
            }
        }

        const state = gameState.generators[id] || { count: 0 };
        const calc = calculateBulkCost(id, state.count, gameState.buyAmount);
        
        if (gameState.energy >= calc.cost) {
            gameState.energy -= calc.cost;
            state.count += calc.amount;
            gameState.generators[id] = state;
            
            // Check milestones for the new total range
            const prevCount = state.count - calc.amount;
            gameData.milestones.forEach(m => {
                if (state.count >= m && prevCount < m) {
                    addLogMessage(`Milestone Reached! ${gameData.generators[id].name}s are now more effective!`, 'major');
                }
            });
            // Update immediately for responsiveness
            updateUI(calculateProduction());
        }
    }
    
    function buyResearch(id) {
        if (gameState.researchState.currentResearch) return;
        
        const cost = getResearchCost(id);
        if (gameState.stardust >= cost && !gameState.research[id]) {
            gameState.stardust -= cost;
            
            // Instant research logic (Prism p6_top)
            let isInstant = false;
            // Calculate time just to check if it's instant
            if (calculateResearchTime(id) < 100) isInstant = true;

            const duration = calculateResearchTime(id);
            const now = Date.now();
            gameState.researchState.currentResearch = id;
            gameState.researchState.researchStartTime = now;
            gameState.researchState.researchEndTime = now + duration;
            
            addLogMessage(`Started Research: ${gameData.research[id].name}`, 'normal');
            
            if (gameState.tempBonuses.isNextResearchFree) {
                gameState.tempBonuses.isNextResearchFree = false;
            }
            updateResearchUI();
        }
    }

    function buyPrismUpgrade(id) {
        if (!id || gameState.purchasedPrisms[id]) return;

        const tech = gameData.prisms[id];
        const depsMet = tech.dependencies.every(dep => gameState.purchasedPrisms[dep]);
        
        if (depsMet && gameState.prisms >= tech.cost) {
            gameState.prisms -= tech.cost;
            gameState.purchasedPrisms[id] = true;
            addLogMessage(`Prism Upgrade Unlocked: ${tech.name}`, 'prism');
            updatePrismTreeUI();
        }
    }

    function completeResearch() {
        const techId = gameState.researchState.currentResearch;
        if (!techId) return;

        gameState.research[techId] = true;
        addLogMessage(`Research Complete: ${gameData.research[techId].name}`, 'major');
        
        gameState.researchState.currentResearch = null;
        gameState.researchState.researchStartTime = 0;
        gameState.researchState.researchEndTime = 0;
        
        updateResearchUI();
    }
    
    function buyConsumable(id) {
        const item = gameData.consumables[id];
        const state = gameState.consumableState[id] || { cooldown: 0, activeUntil: 0 };
        const isTimedBoost = item.type === 'prod_boost' || item.type === 'click_boost' || item.type === 'cost_reduction';
        
        if (gameState.energy < item.cost || state.cooldown > Date.now() || (isTimedBoost && state.activeUntil > Date.now())) {
            return;
        }

        gameState.energy -= item.cost;
        addLogMessage(`Used: ${item.name}!`, 'consumable');

        const cooldownDuration = (id === 'c1' ? 10000 : 5000);
        state.cooldown = Date.now() + cooldownDuration;

        const currentProd = calculateProduction();
        
        // Duration multiplier
        let durationMult = 1;
        if (gameState.purchasedPrisms['p4_top']) durationMult = 1.5;

        switch(item.type) {
            case 'instant_prod':
                const gain = currentProd[item.resource] * item.duration * durationMult;
                gameState[item.resource] += gain;
                break;
            case 'instant_prod_all':
                gameState.energy += currentProd.energy * item.duration * durationMult;
                gameState.stardust += currentProd.stardust * item.duration * durationMult;
                break;
            case 'prod_boost':
            case 'click_boost':
            case 'cost_reduction':
                const bonusType = item.type.split('_')[0] + 'Multiplier';
                gameState.tempBonuses[bonusType] *= item.multiplier;
                state.activeUntil = Date.now() + (item.duration * durationMult * 1000);
                
                setTimeout(() => {
                    gameState.tempBonuses[bonusType] /= item.multiplier;
                    state.activeUntil = 0;
                }, item.duration * durationMult * 1000);
                break;
            case 'free_research':
                gameState.tempBonuses.isNextResearchFree = true;
                break;
            case 'energy_to_stardust':
                const stardustGain = gameState.energy * item.ratio;
                gameState.stardust += stardustGain;
                break;
            case 'prestige_echo':
                const prestigeGain = calculatePrestigeGain();
                if (prestigeGain > 0) {
                    const nebulaGain = Math.max(1, Math.floor(prestigeGain * item.ratio));
                    gameState.nebulaGas += nebulaGain;
                }
                break;
        }
        gameState.consumableState[id] = state;
        updateConsumablesUI();
    }

    function buyCosmicLaw(id) {
        const law = gameData.cosmicLaws[id];
        if (gameState.nebulaGas >= law.cost && !gameState.cosmicLaws[id]) {
            gameState.nebulaGas -= law.cost;
            gameState.cosmicLaws[id] = true;
            addLogMessage(`Cosmic Law Enacted: ${law.name}`, 'major');
            
            if (law.effect.type === 'persistent_research') {
                gameState.research[law.effect.target] = true;
            }
            renderCosmicLaws();
        }
    }

    function calculatePrestigeGain() {
        if (gameState.stats.totalEnergy < 200000) return 0;
        let gain = Math.log(gameState.stats.totalEnergy / 200000) * 12;
        
        if (gameState.cosmicLaws['cl6']) {
            gain *= gameData.cosmicLaws.cl6.effect.multiplier;
        }
        if (gameState.currentTier >= 4) {
            gain *= 3;
        }
        if (gameState.purchasedPrisms['p4_bot']) {
            gain *= 1.05;
        }
        if (gameState.purchasedPrisms['p7_bot']) {
             gain = Math.pow(gain, 2);
        }

        return Math.max(0, Math.floor(gain));
    }
    
    function applyPersistentLaws() {
        if (gameState.cosmicLaws['cl9']) {
            if (!gameState.generators['probe']) gameState.generators['probe'] = { count: 0 };
            if (!gameState.generators['drone']) gameState.generators['drone'] = { count: 0 };
            gameState.generators['probe'].count = Math.max(gameState.generators['probe'].count, 1);
            gameState.generators['drone'].count = Math.max(gameState.generators['drone'].count, 1);
        }
        if (gameState.cosmicLaws['cl11']) {
             gameState.research['r1'] = true;
        }
    }

    function resetRunState(isChallengeStart = false, isTierUp = false) {
        const preserved = {
            // Keep persistent currencies and unlocks
            nebulaGas: gameState.nebulaGas,
            prisms: isTierUp ? 0 : gameState.prisms, // Reset prisms on Tier up
            purchasedPrisms: isTierUp ? {} : gameState.purchasedPrisms, // Reset prism upgrades on Tier up
            bigBangCount: gameState.bigBangCount,
            currentTier: gameState.currentTier,
            cosmicLaws: gameState.cosmicLaws,
            completedChallenges: gameState.completedChallenges,
            notation: gameState.notation,
            activeChallenge: isChallengeStart ? gameState.activeChallenge : null
        };

        gameState = JSON.parse(JSON.stringify(defaultGameState));
        
        gameState.nebulaGas = preserved.nebulaGas;
        gameState.prisms = preserved.prisms;
        gameState.purchasedPrisms = preserved.purchasedPrisms;
        gameState.bigBangCount = preserved.bigBangCount;
        gameState.currentTier = preserved.currentTier;
        gameState.cosmicLaws = preserved.cosmicLaws;
        gameState.completedChallenges = preserved.completedChallenges;
        gameState.notation = preserved.notation;
        gameState.activeChallenge = preserved.activeChallenge;
        
        applyPersistentLaws();
        renderAll();
        saveGame();
    }

    function performBigBang() {
        if (gameState.activeChallenge) {
            addLogMessage("Cannot perform a Big Bang during a challenge.", 'danger');
            return;
        }
        const gain = calculatePrestigeGain();
        if (gain < 1) return;

        gameState.nebulaGas += gain;
        gameState.bigBangCount++;
        
        if (gameState.cosmicLaws['cl13']) {
            const prismGain = gameData.cosmicLaws.cl13.effect.amount;
            gameState.prisms += prismGain;
             addLogMessage(`Gained ${prismGain} Prism from Galactic Commerce.`, 'prism');
        }
        
        addLogMessage(`A new universe is born, granting you ${formatNumber(gain, true)} Nebula Gas!`, 'major');
        resetRunState(false);
    }

    function startChallenge(id) {
        if (gameState.activeChallenge) {
            addLogMessage("You are already in a challenge.", 'danger');
            return;
        }
        if (!gameData.challenges[id].requirement(gameState)) {
            addLogMessage("You have not met the requirements for this challenge.", 'danger');
            return;
        }
        if (confirm(`Are you sure you want to start the "${gameData.challenges[id].name}" challenge? This will reset your current run.`)) {
            gameState.activeChallenge = id;
            addLogMessage(`Challenge Started: ${gameData.challenges[id].name}.`, 'major');
            resetRunState(true);
        }
    }

    function completeChallenge() {
        const id = gameState.activeChallenge;
        if (!id) return;

        gameState.completedChallenges[id] = true;
        addLogMessage(`Challenge Complete: ${gameData.challenges[id].name}! Reward unlocked.`, 'major');
        
        gameState.activeChallenge = null;
        resetRunState(false);
    }

    function abandonChallenge(confirmFirst = true) {
        if (!gameState.activeChallenge) return;
        
        if (confirmFirst && !confirm("Are you sure you want to abandon this challenge? Your progress will be lost.")) {
            return;
        }
        
        addLogMessage(`Challenge Abandoned: ${gameData.challenges[gameState.activeChallenge].name}.`, 'danger');
        gameState.activeChallenge = null;
        resetRunState(false);
    }

    function buyTier() {
        const nextTier = gameState.currentTier + 1;
        if (nextTier > Object.keys(gameData.tiers).length) return;

        const cost = gameData.tiers[nextTier].cost;
        if (gameState.energy >= cost) {
            if (confirm(`Are you sure you want to advance to Tier ${nextTier}? This will reset your run, including Prisms and Research, but you will keep Nebula Gas, Cosmic Laws, and Challenge completions.`)) {
                gameState.currentTier = nextTier;
                addLogMessage(`Congratulations! You have advanced to Tier ${nextTier}!`, 'major');
                resetRunState(false, true); // Perform a Tier Up reset
                renderTiers();
            }
        }
    }

    function toggleNotation() {
        gameState.notation = gameState.notation === 'standard' ? 'scientific' : 'standard';
        updateNotationButton();
    }

    function updateNotationButton() {
        const mode = gameState.notation.charAt(0).toUpperCase() + gameState.notation.slice(1);
        dom.notationToggleButton.textContent = `Notation: ${mode}`;
    }
    
    function formatNumber(num, forceStandard = false) {
        if (num === null || num === undefined || isNaN(num)) return '0';

        if (gameState.notation === 'scientific' && num >= 1000 && !forceStandard) {
            return num.toExponential(2);
        }

        if (num > 0 && num < 0.01 && num !== 0) return num.toFixed(3);
        if (num < 1000) {
            return parseFloat(num.toFixed(2)).toString();
        }
        // Extended suffixes
        const suffixes = [
            "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", 
            "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Od", "Nd", "Vg", "Uvg"
        ];
        const i = Math.floor(Math.log10(num) / 3);
        if (i >= suffixes.length) {
            return num.toExponential(2);
        }
        const value = (num / Math.pow(1000, i));
        const formattedValue = parseFloat(value.toFixed(2)).toString();
        return formattedValue + suffixes[i];
    }
    
    function saveGame(manual = false) {
        try {
            const stateToSave = validateAndRepairGameState(JSON.parse(JSON.stringify(gameState)));
            localStorage.setItem('cosmicForgeSave', JSON.stringify(stateToSave));
            if (manual) {
                addLogMessage('Game Saved');
            }
        } catch(error) {
            console.error("Could not save game:", error);
            if (manual) {
                addLogMessage('ERROR: Could not save game!', 'danger');
            }
        }
    }

    function hardReset() {
        if (confirm("Are you SURE you want to delete everything? This includes all Tiers, Nebula Gas, Cosmic Laws, Prisms, and Challenge completions.")) {
            localStorage.removeItem('cosmicForgeSave');
            window.location.reload();
        }
    }

    // #endregion

    // #region INITIALIZATION
    
    function init() {
        applyPersistentLaws();
        updateNotationButton(); // Set initial button text
        renderAll(); // Creates DOM elements
        setupEventListeners();
        setInterval(gameTick, TICK_RATE);
        setInterval(() => saveGame(false), 4000); 
        addLogMessage("The void awaits your command. Forge the first spark of energy.");
    }

    init();

    // #endregion
});