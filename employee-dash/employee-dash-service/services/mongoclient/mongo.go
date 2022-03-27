package mongoclient

import (
	"context"
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
	localLogger "task-service/local-logger"
	"task-service/models"
)

var mongoClient *MongoClient

type MongoDBCruder interface {
	InsertTask(ctx context.Context, data *models.Task) (*mongo.InsertOneResult, error)
	FindOneTask(ctx context.Context, filter bson.D, variable *models.Task) error
	FindOneAndUpdateTask(ctx context.Context, filter bson.D, variable *models.Task, update bson.D, options *options.FindOneAndUpdateOptions) error
	FindOneAndDeleteTask(ctx context.Context, filter bson.D, variable *models.Task) error
	FindTasks(ctx context.Context, filter bson.D) (*mongo.Cursor, error)
	DeleteManyTasks(ctx context.Context, filter bson.D) error
	InsertEmployee(ctx context.Context, data *models.Employee) (*mongo.InsertOneResult, error)
	FindOneEmployee(ctx context.Context, filter bson.D, variable *models.Employee) error
	FindEmployees(ctx context.Context, filter bson.D) (*mongo.Cursor, error)
	FindOneAndUpdateEmployee(ctx context.Context, filter bson.D, variable *models.Employee, update bson.D, options *options.FindOneAndUpdateOptions) error
	FindOneAndDeleteEmployee(ctx context.Context, filter bson.D, variable *models.Employee) error
	InsertShift(ctx context.Context, data *models.Shift) (*mongo.InsertOneResult, error)
	FindOneShift(ctx context.Context, filter bson.D, variable *models.Shift) error
	FindOneAndUpdateShift(ctx context.Context, filter bson.D, variable *models.Shift, update bson.D, options *options.FindOneAndUpdateOptions) error
	FindShifts(ctx context.Context, filter bson.D) (*mongo.Cursor, error)
	Count(ctx context.Context, databaseName mongodb.DatabaseNames, collectionName mongodb.CollectionNames, filter bson.D) (int, error)
	Disconnect()
}

type MongoClient struct {
	db *mongo.Client
}

func (m *MongoClient) Disconnect() {
	err := m.db.Disconnect(context.TODO())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB disconnect error", "task/task-service/services/mongoClient/mongo.go:47", err.Error())
	}
}

func (m *MongoClient) InsertTask(ctx context.Context, data *models.Task) (*mongo.InsertOneResult, error) {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	result, err := collection.InsertOne(ctx, data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (m *MongoClient) FindOneTask(ctx context.Context, filter bson.D, variable *models.Task) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	err := collection.FindOne(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) DeleteManyTasks(ctx context.Context, filter bson.D) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	_, err := collection.DeleteMany(ctx, filter)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndUpdateTask(ctx context.Context, filter bson.D, variable *models.Task, update bson.D, options *options.FindOneAndUpdateOptions) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	err := collection.FindOneAndUpdate(ctx, filter, update, options).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndDeleteTask(ctx context.Context, filter bson.D, variable *models.Task) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	err := collection.FindOneAndDelete(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindTasks(ctx context.Context, filter bson.D) (*mongo.Cursor, error) {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	return cursor, nil

}

func (m *MongoClient) InsertEmployee(ctx context.Context, data *models.Employee) (*mongo.InsertOneResult, error) {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	result, err := collection.InsertOne(ctx, data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (m *MongoClient) FindOneEmployee(ctx context.Context, filter bson.D, variable *models.Employee) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	err := collection.FindOne(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindEmployees(ctx context.Context, filter bson.D) (*mongo.Cursor, error) {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	return cursor, nil
}

func (m *MongoClient) FindOneAndUpdateEmployee(ctx context.Context, filter bson.D, variable *models.Employee, update bson.D, options *options.FindOneAndUpdateOptions) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	err := collection.FindOneAndUpdate(ctx, filter, update, options).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndDeleteEmployee(ctx context.Context, filter bson.D, variable *models.Employee) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	err := collection.FindOneAndDelete(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}

	collection = m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	_, err = collection.DeleteMany(ctx, bson.D{{"employeeId", variable.Id}})
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) InsertShift(ctx context.Context, data *models.Shift) (*mongo.InsertOneResult, error) {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.SHIFT_COL))
	result, err := collection.InsertOne(ctx, data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (m *MongoClient) FindOneShift(ctx context.Context, filter bson.D, variable *models.Shift) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.SHIFT_COL))
	err := collection.FindOne(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndUpdateShift(ctx context.Context, filter bson.D, variable *models.Shift, update bson.D, options *options.FindOneAndUpdateOptions) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.SHIFT_COL))
	err := collection.FindOneAndUpdate(ctx, filter, update, options).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindShifts(ctx context.Context, filter bson.D) (*mongo.Cursor, error) {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.SHIFT_COL))
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	return cursor, nil

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
		localLogger.Log(logcodes.ERROR, "MongoDB error", "task/task-service/services/mongoClient/mongo.go:215", err.Error())
	} else {
		fmt.Println("[task-service:mongo]: Connected successfully")
	}

	mongoClient = &MongoClient{db: client}
	return mongoClient, nil
}
