import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { Resource } from "@opentelemetry/resources";
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { MicroServiceNames } from "@espressotrip-org/concept-common";
import { GrpcInstrumentation } from "@opentelemetry/instrumentation-grpc";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";

const exporter = new JaegerExporter({
    host: "jaeger",
});
const provider = new NodeTracerProvider({
    resource: new Resource({ [SemanticResourceAttributes.SERVICE_NAME]: MicroServiceNames.ANALYTIC_SERVICE }),
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register();
registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
        new GrpcInstrumentation({
            enabled: true,
        }),
        new PgInstrumentation({
            enabled: true,
            enhancedDatabaseReporting: true,
        }),
    ],
});
