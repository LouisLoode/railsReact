# frozen_string_literal: true

class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  rescue_from ActiveRecord::RecordNotFound, with: :resource_not_found

  private

  def resource_not_found
    render json: { code: 404, error: 'Record Not Found' }, status: :not_found
  end
end
