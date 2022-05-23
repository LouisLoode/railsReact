# frozen_string_literal: true

require 'rails_helper'

# Change this OverviewsController to your project
RSpec.describe Api::V1::OverviewsController, type: :controller do
  describe 'GET #index' do
    describe 'with all validation messages' do
      before do
        create(:objective, weight: nil)
        create(:objective, weight: 100)
        create(:objective, weight: 10)
      end

      it 'returns a success response with all validation messages' do
        get :index, params: {}

        expect(response).to be_successful
        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)

        expect(json).to eq(%w[weight_undefined sum_not_equal_to_hundred])
      end
    end

    describe 'without' do
      let(:objective1) { create(:objective, weight: 100) }

      it 'returns a success response with no validation message' do
        get :index, params: {}

        expect(response).to be_successful
        expect(response).to have_http_status(:ok)

        json = JSON.parse(response.body)

        expect(json).to eq([])
      end
    end
  end
end
