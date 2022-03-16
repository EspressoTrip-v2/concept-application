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
	taskPackage "task-service/proto"
)

var mongoClient *MongoClient

type MongoDBCruder interface {
	InsertOneTask(data *taskPackage.Task, db mongodb.DatabaseNames, col mongodb.CollectionNames) (*mongo.InsertOneResult, error)
	FindOneTask(filter bson.D, variable *taskPackage.Task, db mongodb.DatabaseNames, col mongodb.CollectionNames) error
	FindOneAndUpdateTask(filter bson.D, update bson.D, options *options.FindOneAndUpdateOptions, db mongodb.DatabaseNames, col mongodb.CollectionNames) error
	FindOneAndDeleteTask(filter bson.D, variable *taskPackage.Task, db mongodb.DatabaseNames, col mongodb.CollectionNames) error
	FindTasks(filter bson.D, db mongodb.DatabaseNames, col mongodb.CollectionNames) (*mongo.Cursor, error)
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

func (m MongoClient) InsertOneTask(data *taskPackage.Task, db mongodb.DatabaseNames, col mongodb.CollectionNames) (*mongo.InsertOneResult, error) {
	collection := m.db.Database(string(db)).Collection(string(col))
	result, err := collection.InsertOne(context.TODO(), data)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func (m MongoClient) FindOneTask(filter bson.D, variable *taskPackage.Task, db mongodb.DatabaseNames, col mongodb.CollectionNames) error {
	collection := m.db.Database(string(db)).Collection(string(col))
	err := collection.FindOne(context.TODO(), filter).Decode(variable)
	if err != nil {
		return err
	}
	return nil
}

func (m MongoClient) FindOneAndUpdateTask(filter bson.D, update bson.D, options *options.FindOneAndUpdateOptions, db mongodb.DatabaseNames, col mongodb.CollectionNames) error {
	//TODO implement me
	panic("implement me")
}

func (m MongoClient) FindOneAndDeleteTask(filter bson.D, variable *taskPackage.Task, db mongodb.DatabaseNames, col mongodb.CollectionNames) error {
	//TODO implement me
	panic("implement me")
}

func (m MongoClient) FindTasks(filter bson.D, db mongodb.DatabaseNames, col mongodb.CollectionNames) (*mongo.Cursor, error) {
	//TODO implement me
	panic("implement me")
}

func GetMongoDB() (*MongoClient, *libErrors.CustomError) {
	ctx := context.TODO()
	uri := os.Getenv("MONGO_URI")
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		return nil, libErrors.NewDatabaseError(fmt.Sprintf("MongoDB error: %v", err.Error()))
	}
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
		localLogger.Log(logcodes.ERROR, "MongoDB error", "task/task-service/services/mongoClient/mongo.go:81", err.Error())
	} else {
		fmt.Println("[task-service:mongo]: Connected successfully")
	}

	mongoClient = &MongoClient{db: client}
	return mongoClient, nil
}
