# frozen_string_literal: true

module Api
  module V1
    class OverviewsController < ApplicationController
      # GET /overviews
      def index
        result = []

        {
          weight_undefined: Objective.weight_undefined?,
          sum_not_equal_to_hundred: Objective.sum_not_equal_to_hundred?
        }.each do |key, value|
          result.push(key) if value == true
        end
        render json: result
      end
    end
  end
end
