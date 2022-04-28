# frozen_string_literal: true

module Api
  module V1
    class ObjectivesController < ApplicationController
      before_action :set_objective, only: %i[show update destroy]

      # GET /objectives
      def index
        @objectives = Objective.all
        render json: Api::V1::ObjectiveSerializer.new(@objectives).serializable_hash
      end

      # GET /objectives/1
      def show
        render json: Api::V1::ObjectiveSerializer.new(@objective).serializable_hash
      end

      # POST /objectives
      def create
        @objective = Objective.new(objective_params)

        if @objective.save
          render json: Api::V1::ObjectiveSerializer.new(@objective).serializable_hash, status: :created
        else
          render json: @objective.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /objectives/1
      def update
        if @objective.update(objective_params)
          render json: Api::V1::ObjectiveSerializer.new(@objective).serializable_hash
        else
          render json: @objective.errors, status: :unprocessable_entity
        end
      end

      # DELETE /objectives/1
      def destroy
        @objective.destroy
      end

      private

      # Use callbacks to share common setup or constraints between actions.
      def set_objective
        @objective = Objective.find(params[:id])
      end

      # Only allow a list of trusted parameters through.
      def objective_params
        params.require(:objective).permit(:title, :weight)
      end
    end
  end
end
