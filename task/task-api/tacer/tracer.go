package tacer

import (
	"context"
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/microservice/microserviceNames"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/exporters/jaeger"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	tracesdk "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
	"go.opentelemetry.io/otel/trace"
	"os"
)

var traceInstance *TraceInstance

type TraceInstance struct {
	Tracer trace.Tracer
}

func (t *TraceInstance) Start(ctx context.Context, name string) (context.Context, trace.Span) {
	return t.Tracer.Start(ctx, name)
}

func NewTraceProvider(host string) (*tracesdk.TracerProvider, *libErrors.CustomError) {
	environment := os.Getenv("ENVIRONMENT")
	if environment == "" {
		environment = "develop"
	}
	version := os.Getenv("VERSION")
	if version == "" {
		version = "v1.0.0"
	}
	exporter, err := jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(fmt.Sprintf("http://%v:14268/api/traces", host))))
	if err != nil {
		return nil, libErrors.NewBadRequestError(err.Error())
	}
	traceProvider := tracesdk.NewTracerProvider(
		tracesdk.WithBatcher(exporter),
		tracesdk.WithResource(
			resource.NewWithAttributes(semconv.SchemaURL,
				semconv.ServiceNameKey.String(string(microserviceNames.TASK_API)),
				semconv.ServiceVersionKey.String(version),
				attribute.String("environment", environment))))

	otel.SetTracerProvider(traceProvider)
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))
	return traceProvider, nil
}

func GetTracer() *TraceInstance {
	if traceInstance == nil {
		traceInstance = &TraceInstance{
			Tracer: otel.Tracer(string(microserviceNames.TASK_API)),
		}
		return traceInstance
	}
	return traceInstance
}
