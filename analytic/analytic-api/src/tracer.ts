import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { MicroServiceNames } from "@espressotrip-org/concept-common";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { ExpressInstrumentation, ExpressLayerType } from "@opentelemetry/instrumentation-express";
import { GrpcInstrumentation } from "@opentelemetry/instrumentation-grpc";

const exporter = new JaegerExporter({
    host: "jaeger",
});
const provider = new NodeTracerProvider({
    resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: MicroServiceNames.ANALYTIC_API,
        version: process.env.VERSION! || "v1.0.0", environment: process.env.ENVIRONMENT || "develop"  }),
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();
// @ts-ignore
registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
        new HttpInstrumentation({
            enabled: true,
        }),
        new ExpressInstrumentation({
            enabled: true,
            ignoreLayersType: [ExpressLayerType.ROUTER, ExpressLayerType.MIDDLEWARE],
        }),
        new GrpcInstrumentation({
            enabled: true,
        }),
    ],
});
