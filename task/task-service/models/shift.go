package models

import taskPackage "task-service/proto"

type Shift struct {
	Id       string `bson:"_id,omitempty"`
	Division string `bson:"division"`
	Type     string `bson:"type"`
	Start    string `bson:"start"`
	End      string `bson:"end"`
}

func (s *Shift) ConvertToMessage() *taskPackage.Shift {
	return &taskPackage.Shift{
		Id:       s.Id,
		Division: s.Division,
		Type:     s.Type,
		Start:    s.Start,
		End:      s.End,
	}
}
