package mongo

import (
	"context"
	"fmt"
	libErrors "github.com/EspressoTrip-v2/concept-go-common/lib-errors"
	"github.com/EspressoTrip-v2/concept-go-common/logcodes"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"os"
	localLogger "task-service/local-logger"
)

var mongoClient *MongoClient

type MongoClienter interface {
	FindOne(filter bson.D, collection string, variable *interface{}) (*libErrors.CustomError, bool)
	Find(filter bson.D, collection string, variable *interface{}) (*mongo.Cursor, *libErrors.CustomError)
	FindOneAndDelete(filter bson.D, collection string, variable *interface{}) (*libErrors.CustomError, bool)
	FindOneAndUpdate(filter bson.D, update bson.D, collection string, upsert bool, variable *interface{}) (*libErrors.CustomError, bool)
	InsertOne(data interface{}, collection string, variable *interface{}) (*libErrors.CustomError, *primitive.ObjectID)
}

type MongoClient struct {
	collections   map[string]*mongo.Collection
	mongoClient   *mongo.Client
	ctx           context.Context
	connectionUri string
}

func (m *MongoClient) FindOne(filter bson.D, collection string, variable *interface{}) (*libErrors.CustomError, bool) {
	if m.collections[collection] == nil {
		return libErrors.NewDatabaseError(fmt.Sprintf("Collection does not exist")), false
	}
	err := m.collections[collection].FindOne(m.ctx, filter).Decode(variable)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, false
		}
		return libErrors.NewDatabaseError(fmt.Sprintf("Internal database error: %v", err.Error())), false
	}
	return nil, true
}

func (m *MongoClient) Find(filter bson.D, collection string, variable *interface{}) (*mongo.Cursor, *libErrors.CustomError) {
	//TODO implement me
	panic("implement me")
}

func (m *MongoClient) FindOneAndDelete(filter bson.D, collection string, variable *interface{}) (*libErrors.CustomError, bool) {
	if m.collections[collection] == nil {
		return libErrors.NewDatabaseError(fmt.Sprintf("Collection does not exist")), false
	}
	err := m.collections[collection].FindOneAndDelete(m.ctx, filter).Decode(variable)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, false
		}
		return libErrors.NewDatabaseError(fmt.Sprintf("Internal database error: %v", err.Error())), false
	}
	return nil, true
}

func (m *MongoClient) FindOneAndUpdate(filter bson.D, update bson.D, collection string, upsert bool, variable *interface{}) (*libErrors.CustomError, bool) {
	if m.collections[collection] == nil {
		return libErrors.NewDatabaseError(fmt.Sprintf("Collection does not exist")), false
	}
	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	err := m.collections[collection].FindOneAndUpdate(m.ctx, filter, update, opts).Decode(variable)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, false
		}
		return libErrors.NewDatabaseError(fmt.Sprintf("Internal database error: %v", err.Error())), false
	}
	return nil, true
}

func (m *MongoClient) InsertOne(data interface{}, collection string) (*libErrors.CustomError, *primitive.ObjectID) {
	if m.collections[collection] == nil {
		return libErrors.NewDatabaseError(fmt.Sprintf("Collection does not exist")), nil
	}
	res, err := m.collections[collection].InsertOne(m.ctx, data)
	if err != nil {
		return libErrors.NewDatabaseError(fmt.Sprintf("Could not insert new document: %v", err.Error())), nil
	}
	oid, ok := res.InsertedID.(primitive.ObjectID)
	if !ok {
		return libErrors.NewDatabaseError(fmt.Sprintf("Could not convert objectId: %v", err.Error())), nil
	}
	return nil, &oid
}

func GetMongoClient() *MongoClient {
	if mongoClient != nil {
		return mongoClient
	}
	mongoClient = &MongoClient{connectionUri: os.Getenv("MONGO_URI"), ctx: context.TODO()}
	return mongoClient
}

func (m *MongoClient) Connect() *libErrors.CustomError {
	var err error
	m.mongoClient, err = mongo.Connect(m.ctx, options.Client().ApplyURI(m.connectionUri))
	if err != nil {
		return libErrors.NewDatabaseError(fmt.Sprintf("[task-service:mongo]: Connection error -> %v\n", err.Error()))
	}

	go func() {
		if err := m.mongoClient.Disconnect(m.ctx); err != nil {
			localLogger.Log(logcodes.ERROR, "MongoDB client disconnected", "task/task-service/services/mongo/mongo.go:113", err.Error())
		}
	}()

	fmt.Println("[task-service:mongo]: Connected successfully")
	return nil
}

func (m MongoClient) AddCollections(databaseName string, collectionName string) *libErrors.CustomError {
	if m.mongoClient == nil {
		return libErrors.NewDatabaseError("[task-service:mongo]: Mongo client not available")
	}
	m.collections[collectionName] = m.mongoClient.Database(databaseName).Collection(collectionName)
	return nil
}

func BuildFilter(queryMap map[string]string) bson.D {
	b := bson.D{}
	for k, v := range queryMap {
		b = append(b, primitive.E{
			Key:   k,
			Value: v,
		})
	}
	return b
}
