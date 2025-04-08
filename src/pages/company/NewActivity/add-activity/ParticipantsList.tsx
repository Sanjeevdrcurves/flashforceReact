
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { X, Plus, UserPlus } from "lucide-react";

interface Participant {
  id: string;
  name: string;
  email: string;
  external: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: string, value: any) => void;
}

export const ParticipantsList: React.FC<ParticipantsListProps> = ({
  participants,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Participants</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="h-8 px-2 text-xs"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Add Participant
        </Button>
      </div>

      {participants.length === 0 ? (
        <div className="text-sm text-gray-500 italic">No participants added</div>
      ) : (
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-start space-x-2">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Name"
                  value={participant.name}
                  onChange={(e) =>
                    onUpdate(participant.id, "name", e.target.value)
                  }
                  className="h-8"
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={participant.email}
                  onChange={(e) =>
                    onUpdate(participant.id, "email", e.target.value)
                  }
                  className="h-8"
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`external-${participant.id}`}
                    checked={participant.external}
                    onCheckedChange={(checked) =>
                      onUpdate(participant.id, "external", checked)
                    }
                  />
                  <Label htmlFor={`external-${participant.id}`} className="text-sm">
                    External participant
                  </Label>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(participant.id)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
