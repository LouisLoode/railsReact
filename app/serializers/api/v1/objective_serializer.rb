# frozen_string_literal: true

module Api
  module V1
    class ObjectiveSerializer
      include JSONAPI::Serializer
      attributes :title, :weight, :updated_at, :created_at
    end
  end
end
