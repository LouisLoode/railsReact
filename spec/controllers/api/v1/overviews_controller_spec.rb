require 'rails_helper'

# Change this OverviewsController to your project
RSpec.describe Api::V1::OverviewsController, type: :controller do
  describe 'GET #index' do
    describe 'with all validation messages' do
      let!(:objective) { create(:objective, weight: nil) }
      let!(:objective2) { create(:objective, weight: 100) }
      let!(:objective3) { create(:objective, weight: 10) }

      it 'returns a success response with all validation messages' do
        get :index, params: {}

        expect(response).to be_successful
        expect(response).to have_http_status(200)

        json = JSON.parse(response.body)

        expect(json).to eq(['weight_undefined', 'sum_not_equal_to_hundred'])
      end
    end

    describe 'without' do
      let!(:objective1) { create(:objective, weight: 100) }

      it 'returns a success response with no validation message' do
        get :index, params: {}

        expect(response).to be_successful
        expect(response).to have_http_status(200)

        json = JSON.parse(response.body)

        expect(json).to eq([])
      end
    end
  end
end