class Api::V1::ObjectiveSerializer
  include JSONAPI::Serializer
  attributes :title, :weight, :updated_at, :created_at
end