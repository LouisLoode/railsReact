# frozen_string_literal: true

require 'rails_helper'

# Change this ObjectivesController to your project
RSpec.describe Api::V1::ObjectivesController, type: :controller do
  describe 'GET #index' do
    let(:objective) { create(:objective) }

    it 'returns a success response' do
      get :index, params: {}

      expect(response).to be_successful
      expect(response).to have_http_status(:ok)
    end
  end

  describe 'GET #show' do
    let!(:objective) { create(:objective) }

    it 'returns a success response' do
      get :show, params: {
        id: objective.id
      }

      expect(response).to be_successful
      expect(response).to have_http_status(:ok)
    end

    it 'returns a not found error response' do
      get :show, params: {
        id: 'UNKNOWN'
      }

      body = JSON.parse(response.body)

      expect(response).to have_http_status(:not_found)
      expect(body['code']).to eq(404)
      expect(body['error']).to eq('Record Not Found')
    end
  end

  describe 'POST #objective' do
    let(:objective_attributes) { attributes_for(:objective) }

    it 'returns a success response' do
      expect(Objective.count).to eq(0)

      post :create, params: {
        objective: objective_attributes
      }

      expect(response.status).to eq(201)
      expect(response.content_type).to eq('application/json; charset=utf-8')

      json = JSON.parse(response.body)

      expect(json['data']).to have_key('id')
      expect(json['data']['attributes']).to have_key('created_at')
      expect(json['data']['attributes']).to have_key('updated_at')

      expect(json['data']['attributes'][:title]).to eq(objective_attributes['title'])
      expect(json['data']['attributes'][:weight]).to eq(objective_attributes['weight'])

      expect(Objective.count).to eq(1)
    end

    it 'returns a error response' do
      expect(Objective.count).to eq(0)

      post :create, params: {
        objective: {
          title: nil,
          weight: 'invalid'
        }
      }

      expect(response.status).to eq(422)
      expect(response.content_type).to eq('application/json; charset=utf-8')

      json = JSON.parse(response.body)

      expect(json['title']).to eq(["can't be blank"])
      expect(json['weight']).to eq(['is not a number'])

      expect(Objective.count).to eq(0)
    end
  end

  describe 'PUT #objective' do
    let!(:objective) { create(:objective) }

    it 'returns a success response' do
      expect(Objective.count).to eq(1)

      put :update, params: {
        id: objective.id,
        objective: {
          title: 'TITLE UPDATE',
          weight: 15
        }
      }

      expect(response.status).to eq(200)
      expect(response.content_type).to eq('application/json; charset=utf-8')

      json = JSON.parse(response.body)

      expect(json['data']).to have_key('id')
      expect(json['data']['attributes']).to have_key('created_at')
      expect(json['data']['attributes']).to have_key('updated_at')

      expect(json['data']['attributes']['title']).to eq('TITLE UPDATE')
      expect(json['data']['attributes']['weight']).to eq(15)

      expect(Objective.count).to eq(1)
    end

    it 'returns a not found error response' do
      put :update, params: {
        id: 'UNKNOWN',
        title: 'TITLE UPDATE',
        weight: 55
      }

      body = JSON.parse(response.body)

      expect(response).to have_http_status(:not_found)
      expect(body['code']).to eq(404)
      expect(body['error']).to eq('Record Not Found')
    end
  end

  describe 'DELETE #objective' do
    let!(:objective) { create(:objective) }

    it 'returns a success response' do
      expect(Objective.count).to eq(1)

      delete :destroy, params: {
        id: objective.id
      }

      expect(response.status).to eq(204)

      expect(Objective.count).to eq(0)
    end

    it 'returns a not found error response' do
      delete :destroy, params: {
        id: 'UNKNOWN'
      }

      body = JSON.parse(response.body)

      expect(response).to have_http_status(:not_found)
      expect(body['code']).to eq(404)
      expect(body['error']).to eq('Record Not Found')
    end
  end
end
