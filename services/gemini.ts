
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WorkflowStep, Brand, ApexTrigger, ArbitrageNode, FinancialForecast, RiskAssessment, Invoice, SpatialParcel, CodeExecutionPart, SovereignRepo } from "../types";

export class GeminiService {
  private getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  /**
   * NPR NATIVE PARALLEL REASONER v1.0
   * Implements teacher-free Map-Process-Reduce schema.
   */
  async runNPRReasoning(task: string): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `[NPR ENGINE: PARALLEL_REASON_MODE]
 TASK: ${task}
 
 SCHEMA:
 1. <map>: Decompose into 3 parallel logic branches.
 2. <process>: Execute thought branches independently.
 3. <reduce>: Synthesize parallel outputs into a Sovereign Alpha Result.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    return response.text || "Reasoning cycle failed.";
  }

  /**
   * CLUSTER AUTO-CORRECT & SELF-HEALING
   */
  async runSelfHealingOrchestration(errorContext: string): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `[SOVEREIGN_AUTO_CORRECT: ACTIVE]
      CONTEXT: ${errorContext}
      
      Determine optimal remediation path for K8s pod issues, resource exhaustion, or alignment drift.
      Suggest kubectl commands and parameter adjustments.`,
    });
    return response.text || "Self-healing node failed.";
  }

  /**
   * GROUNDED GLOBAL SEARCH
   */
  async runGroundedSearch(query: string): Promise<{ text: string; sources: { web: { uri: string; title: string } }[] }> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.filter((chunk: any) => chunk.web)
      ?.map((chunk: any) => ({
        web: {
          uri: chunk.web.uri,
          title: chunk.web.title
        }
      })) || [];

    return {
      text: response.text || "No intelligence found.",
      sources
    };
  }

  /**
   * STRUCTURED ALPHA STRATEGY ANALYSIS
   */
  async analyzeStructuredAlpha(ticker: string, initial: number, current: number): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze a Dual Directional Trigger PLUS strategy for ${ticker}. 
      Initial Index Level: ${initial}. 
      Current/Final Level: ${current}. 
      Explain the payoff scenario based on a 75% trigger level and absolute return features for moderate declines.`,
    });
    return response.text || "Wealth engineering node failed.";
  }

  /**
   * SECURITY INTEGRITY SWEEP
   */
  async runSecuritySweep(ip: string, openPorts: number[]): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a vulnerability analysis for IP ${ip} with detected open ports: ${openPorts.join(', ')}. 
      Identify potential IoT sensor risks and suggest hardening steps.`,
    });
    return response.text || "Security node failure.";
  }

  /**
   * QUANTUM ARBITRAGE ANALYSIS
   */
  async analyzeQuantumArbitrage(imageUrl: string, mimeType: string): Promise<string> {
    const ai = this.getClient();
    const base64Data = imageUrl.includes('base64,') ? imageUrl.split('base64,')[1] : imageUrl;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Analyze this asset for market arbitrage potential. Identify identifying features, estimated wholesale value, and high-demand corporate buyer profiles." }
        ]
      }
    });
    return response.text || "Analysis disrupted.";
  }

  /**
   * COMPUTATIONAL REASONING NODE
   */
  async runComputationalReasoning(prompt: string): Promise<CodeExecutionPart[]> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ codeExecution: {} }]
      }
    });

    const results: CodeExecutionPart[] = [];
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.text) results.push({ text: part.text });
      if (part.executableCode) results.push({ executableCode: part.executableCode });
      if (part.codeExecutionResult) results.push({ codeExecutionResult: part.codeExecutionResult });
    }
    return results;
  }

  /**
   * IMAGE GENERATION
   */
  async generateImage(prompt: string, config: { aspectRatio: string, quality: string }): Promise<string> {
    const ai = this.getClient();
    const model = config.quality === 'high' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio as any,
          imageSize: config.quality === 'high' ? "1K" : undefined
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  }

  /**
   * VIDEO GENERATION (VEO)
   */
  async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> {
    const ai = this.getClient();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    return `${downloadLink}&key=${process.env.API_KEY}`;
  }

  /**
   * SOURCE INTEL ANALYSIS
   */
  async runRepoAnalysis(repoName: string): Promise<{ patterns: string[], summary: string }> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the architectural patterns of the repository: ${repoName}. Identify core logical units and provide a summary of the siphoned logic.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          },
          required: ["patterns", "summary"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { patterns: [], summary: "Analysis failed." };
    }
  }

  async runTuckerOrchestration(context: string): Promise<string> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `[TUCKER ORCHESTRATOR v12.0]
      CONTEXT: ${context}
      Execute full sovereign cycle optimization plan.`,
      config: { thinkingConfig: { thinkingBudget: 16000 } }
    });
    return response.text;
  }

  async executeWorkflowStep(brand: Brand, key: string, step: WorkflowStep) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Execute workflow step ${step.name} for brand ${brand.name}. Workflow type: ${key}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            logs: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "logs"]
        }
      }
    });
    return JSON.parse(response.text);
  }

  async fetchParcelIntelligence(pin: string): Promise<SpatialParcel> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Fetch detailed spatial intel for parcel PIN ${pin}. Return PostGIS OID, owner, county, timber species, volume, canopy height, and subsurface feature inferences.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            pin: { type: Type.STRING },
            countyName: { type: Type.STRING },
            ownerInfo: { type: Type.OBJECT, properties: { name: { type: Type.STRING } } },
            inferences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  featureType: { type: Type.STRING },
                  probability: { type: Type.NUMBER },
                  metadata: { type: Type.OBJECT, properties: { details: { type: Type.STRING } } }
                }
              }
            },
            timber: {
              type: Type.OBJECT,
              properties: {
                species: { type: Type.STRING },
                volume: { type: Type.NUMBER },
                canopyHeight: { type: Type.NUMBER }
              }
            }
          },
          required: ["pin", "inferences"]
        }
      }
    });
    return JSON.parse(response.text);
  }

  async scanApexTriggers(): Promise<ApexTrigger[]> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Scan spatial apex triggers for imminent infrastructure shifts.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              type: { type: Type.STRING },
              targetEntity: { type: Type.STRING },
              threshold: { type: Type.NUMBER },
              currentValue: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }

  async fetchArbitrageAllocations(): Promise<ArbitrageNode[]> {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Fetch current zero-inventory arbitrage allocations for middleman profit extraction.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              supplierNode: { type: Type.STRING },
              buyerNode: { type: Type.STRING },
              status: { type: Type.STRING },
              allocation: { type: Type.STRING },
              riskScore: { type: Type.STRING },
              commodity: { type: Type.STRING },
              roi: { type: Type.STRING },
              buyPrice: { type: Number },
              sellPrice: { type: Number },
              delta: { type: Number }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }

  async performInstitutionalMegaScan() {
    return this.runGroundedSearch("Institutional supply chain deltas, Blackwell production shifts, and middleman arbitrage opportunities for 2026.");
  }

  async scanFintechNodes() {
    return this.runGroundedSearch("Fortune 500 middleman settlement deltas and ISO-20022 liquidity rail status.");
  }

  async getFinancialForecast(balance: number, history: any[]) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate financial liquidity forecast based on current balance of ${balance}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              period: { type: Type.STRING },
              inflow: { type: Type.NUMBER },
              outflow: { type: Type.NUMBER },
              netPosition: { type: Type.NUMBER },
              confidence: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }

  async assessCounterpartyRisk(entity: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Assess counterparty risk for institutional entity: ${entity}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING },
            score: { type: Type.NUMBER },
            factors: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }

  async generatePredictiveInvoices() {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 10 predictive high-value institutional invoices for the Sovereign Node.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              customerName: { type: Type.STRING },
              amount: { type: Type.NUMBER },
              status: { type: Type.STRING },
              dueDate: { type: Type.STRING },
              predictedDate: { type: Type.STRING },
              probability: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }

  async runQuantumSpatialOptimization(parcel: string, node: string) {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate quantum spatial route optimization between ${parcel} and ${node}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimized_path: { type: Type.ARRAY, items: { type: Type.STRING } },
            quantum_confidence: { type: Type.NUMBER },
            ansatz_depth: { type: Type.INTEGER },
            qubit_entanglement: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  }

  async getIBMTechnicalSweep() {
    const ai = this.getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Execute IBM Technical Sweep for route reliability."
    });
    return response.text;
  }

  async getDeepIntel(ticker: string) {
    return this.runGroundedSearch(`Deep financial intel for ${ticker} related to Blackwell demand and Rigetti quantum adoption.`);
  }

  connectLive(callbacks: any, systemInstruction: string) {
    const ai = this.getClient();
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction: systemInstruction,
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      }
    });
  }
}

export const gemini = new GeminiService();
