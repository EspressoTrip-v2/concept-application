package mongoclient

import (
	"context"
	localLogger "employee-dash-service/local-logger"
	"employee-dash-service/models"
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/mongodb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"go.opentelemetry.io/contrib/instrumentation/go.mongodb.org/mongo-driver/mongo/otelmongo"
	"os"
)

var mongoClient *MongoClient

type MongoDBCruder interface {
	FindOneEmployee(ctx context.Context, filter bson.D, variable *models.Employee) error
	FindOneAndUpdateEmployee(ctx context.Context, filter bson.D, variable *models.Employee, update bson.D, options *options.FindOneAndUpdateOptions) error
	FindOneAndDeleteEmployee(ctx context.Context, filter bson.D, variable *models.Employee) error
	InsertEmployee(ctx context.Context, data *models.Employee) (*mongo.InsertOneResult, error)
	Count(ctx context.Context, databaseName mongodb.DatabaseNames, collectionName mongodb.CollectionNames, filter bson.D) (int, error)
	Disconnect()
}

type MongoClient struct {
	db *mongo.Client
}

func (m *MongoClient) Disconnect() {
	err := m.db.Disconnect(context.TODO())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB disconnect error", "employee-dash/employee-dash-service/services/mongoClient/mongo.go:37", err.Error())
	}
}
func (m *MongoClient) InsertEmployee(ctx context.Context, data *models.Employee) (*mongo.InsertOneResult, error) {
	collection := m.db.Database(string(mongodb.DASHBOARD_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	result, err := collection.InsertOne(ctx, data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (m *MongoClient) FindOneEmployee(ctx context.Context, filter bson.D, variable *models.Employee) error {
	collection := m.db.Database(string(mongodb.DASHBOARD_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	err := collection.FindOne(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndUpdateEmployee(ctx context.Context, filter bson.D, variable *models.Employee, update bson.D, options *options.FindOneAndUpdateOptions) error {
	collection := m.db.Database(string(mongodb.DASHBOARD_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	err := collection.FindOneAndUpdate(ctx, filter, update, options).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndDeleteEmployee(ctx context.Context, filter bson.D, variable *models.Employee) error {
	collection := m.db.Database(string(mongodb.DASHBOARD_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	err := collection.FindOneAndDelete(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m MongoClient) Count(ctx context.Context, databaseName mongodb.DatabaseNames, collectionName mongodb.CollectionNames, filter bson.D) (int, error) {
	collection := m.db.Database(string(databaseName)).Collection(string(collectionName))
	count, err := collection.CountDocuments(ctx, filter)
	if err != nil {
		return 0, err
	}
	return int(count), nil
}

func GetMongoDB() (*MongoClient, *libErrors.CustomError) {
	ctx := context.TODO()
	uri := os.Getenv("MONGO_URI")
	opts := options.Client()
	opts.ApplyURI(uri)
	opts.Monitor = otelmongo.NewMonitor()
	client, err := mongo.Connect(ctx, opts)
	if err != nil {
		return nil, libErrors.NewDatabaseError(fmt.Sprintf("MongoDB error: %v", err.Error()))
	}
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB error", "employee-dash/employee-dash-service/services/mongoClient/mongo.go:102", err.Error())
	} else {
		fmt.Println("[employee-dash-service:mongo]: Connected successfully")
	}

	mongoClient = &MongoClient{db: client}
	return mongoClient, nil
}
