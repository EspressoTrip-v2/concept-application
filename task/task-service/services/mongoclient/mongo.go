package mongoclient

import (
	"context"
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/liberrors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"github.com/EspressoTrip-v2/concept-go-common/mongodb"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"os"
	localLogger "task-service/local-logger"
	"task-service/models"
)

var mongoClient *MongoClient

type MongoDBCruder interface {
	InsertOneTask(ctx context.Context, data *models.TaskItem) (*mongo.InsertOneResult, error)
	FindOneTask(ctx context.Context, filter bson.D, variable *models.TaskItem) error
	FindOneAndUpdateTask(ctx context.Context, filter bson.D, variable *models.TaskItem, update bson.D, options *options.FindOneAndUpdateOptions) error
	FindOneAndDeleteTask(ctx context.Context, filter bson.D, variable *models.TaskItem) error
	FindTasks(ctx context.Context, filter bson.D) (*mongo.Cursor, error)
	InsertEmployee(ctx context.Context, data *models.EmployeeItem) (*mongo.InsertOneResult, error)
	FindOneEmployee(ctx context.Context, filter bson.D, variable *models.EmployeeItem) error
	FindEmployees(ctx context.Context, filter bson.D) (*mongo.Cursor, error)
	FindOneAndUpdateEmployee(ctx context.Context, filter bson.D, variable *models.EmployeeItem, update bson.D, options *options.FindOneAndUpdateOptions) error
	FindOneAndDeleteEmployee(ctx context.Context, filter bson.D, variable *models.EmployeeItem) error
	Disconnect()
}

type MongoClient struct {
	db *mongo.Client
}

func (m *MongoClient) Disconnect() {
	err := m.db.Disconnect(context.TODO())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB disconnect error", "task/task-service/services/mongoClient/mongo.go:36", err.Error())
	}
}

func (m *MongoClient) InsertOneTask(ctx context.Context, data *models.TaskItem) (*mongo.InsertOneResult, error) {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	result, err := collection.InsertOne(ctx, data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (m *MongoClient) FindOneTask(ctx context.Context, filter bson.D, variable *models.TaskItem) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	err := collection.FindOne(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndUpdateTask(ctx context.Context, filter bson.D, variable *models.TaskItem, update bson.D, options *options.FindOneAndUpdateOptions) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	err := collection.FindOneAndUpdate(ctx, filter, update, options).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndDeleteTask(ctx context.Context, filter bson.D, variable *models.TaskItem) error {
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

func (m *MongoClient) InsertEmployee(ctx context.Context, data *models.EmployeeItem) (*mongo.InsertOneResult, error) {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	result, err := collection.InsertOne(ctx, data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (m *MongoClient) FindOneEmployee(ctx context.Context, filter bson.D, variable *models.EmployeeItem) error {
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

func (m *MongoClient) FindOneAndUpdateEmployee(ctx context.Context, filter bson.D, variable *models.EmployeeItem, update bson.D, options *options.FindOneAndUpdateOptions) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	err := collection.FindOneAndUpdate(ctx, filter, update, options).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoClient) FindOneAndDeleteEmployee(ctx context.Context, filter bson.D, variable *models.EmployeeItem) error {
	collection := m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.EMPLOYEE_COL))
	err := collection.FindOneAndDelete(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}

	collection = m.db.Database(string(mongodb.TASK_DB)).Collection(string(mongodb.TASK_COL))
	oid, err := primitive.ObjectIDFromHex(variable.Id)
	if err != nil {
		return err
	}
	_, err = collection.DeleteMany(ctx, bson.D{{"employeeId", oid}})
	if err != nil {
		return err
	}
	return nil
}

func GetMongoDB() (*MongoClient, *libErrors.CustomError) {
	ctx := context.TODO()
	uri := os.Getenv("MONGO_URI")
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return nil, libErrors.NewDatabaseError(fmt.Sprintf("MongoDB error: %v", err.Error()))
	}
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB error", "task/task-service/services/mongoClient/mongo.go:81", err.Error())
	} else {
		fmt.Println("[task-service:mongo]: Connected successfully")
	}

	mongoClient = &MongoClient{db: client}
	return mongoClient, nil
}
