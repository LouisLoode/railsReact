# require "rails_helper"

RSpec.describe Api::V1::ObjectivesController, type: :routing do
  describe "routing", :only => true do
    it "routes to #index" do
      expect(get: "/api/v1/objectives").to route_to("api/v1/objectives#index")
    end

    it "routes to #show" do
      expect(get: "/api/v1/objectives/1").to route_to("api/v1/objectives#show", id: "1")
    end

    it "routes to #create" do
      expect(post: "/api/v1/objectives").to route_to("api/v1/objectives#create")
    end

    it "routes to #update via PUT" do
      expect(put: "/api/v1/objectives/1").to route_to("api/v1/objectives#update", id: "1")
    end

    it "routes to #update via PATCH" do
      expect(patch: "/api/v1/objectives/1").to route_to("api/v1/objectives#update", id: "1")
    end

    it "routes to #destroy" do
      expect(delete: "/api/v1/objectives/1").to route_to("api/v1/objectives#destroy", id: "1")
    end
  end
end
