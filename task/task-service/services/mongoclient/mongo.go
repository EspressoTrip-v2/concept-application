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
	"os"
	localLogger "task-service/local-logger"
	"task-service/models"
)

var mongoClient *MongoClient

type MongoDBCruder interface {
	InsertOneTask(ctx context.Context, data *models.TaskItem, db mongodb.DatabaseNames, col mongodb.CollectionNames) (*mongo.InsertOneResult, error)
	FindOneTask(ctx context.Context, filter bson.D, variable *models.TaskItem, db mongodb.DatabaseNames, col mongodb.CollectionNames) error
	FindOneAndUpdateTask(ctx context.Context, filter bson.D, variable *models.TaskItem, update bson.D, options *options.FindOneAndUpdateOptions, db mongodb.DatabaseNames, col mongodb.CollectionNames) error
	FindOneAndDeleteTask(ctx context.Context, filter bson.D, variable *models.TaskItem, db mongodb.DatabaseNames, col mongodb.CollectionNames) error
	FindTasks(ctx context.Context, filter bson.D, db mongodb.DatabaseNames, col mongodb.CollectionNames) (*mongo.Cursor, error)
	Disconnect()
}

type MongoClient struct {
	db *mongo.Client
}

func (m MongoClient) Disconnect() {
	err := m.db.Disconnect(context.TODO())
	if err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB disconnect error", "task/task-service/services/mongoClient/mongo.go:36", err.Error())
	}
}

func (m MongoClient) InsertOneTask(ctx context.Context, data *models.TaskItem, db mongodb.DatabaseNames, col mongodb.CollectionNames) (*mongo.InsertOneResult, error) {
	collection := m.db.Database(string(db)).Collection(string(col))
	result, err := collection.InsertOne(ctx, data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (m MongoClient) FindOneTask(ctx context.Context, filter bson.D, variable *models.TaskItem, db mongodb.DatabaseNames, col mongodb.CollectionNames) error {
	collection := m.db.Database(string(db)).Collection(string(col))
	err := collection.FindOne(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m MongoClient) FindOneAndUpdateTask(ctx context.Context, filter bson.D, variable *models.TaskItem, update bson.D, options *options.FindOneAndUpdateOptions, db mongodb.DatabaseNames, col mongodb.CollectionNames) error {
	collection := m.db.Database(string(db)).Collection(string(col))
	err := collection.FindOneAndUpdate(ctx, filter, update, options).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m MongoClient) FindOneAndDeleteTask(ctx context.Context, filter bson.D, variable *models.TaskItem, db mongodb.DatabaseNames, col mongodb.CollectionNames) error {
	collection := m.db.Database(string(db)).Collection(string(col))
	err := collection.FindOneAndDelete(ctx, filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m MongoClient) FindTasks(ctx context.Context, filter bson.D, db mongodb.DatabaseNames, col mongodb.CollectionNames) (*mongo.Cursor, error) {
	collection := m.db.Database(string(db)).Collection(string(col))
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	return cursor, nil

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
