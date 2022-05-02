# frozen_string_literal: true

require 'capybara/rspec'

RSpec.configure do |config|
  Capybara.default_driver = ENV['GUI'] ? :selenium_chrome : :selenium_chrome_headless
  config.formatter = :documentation
  config.filter_run :focus
  config.run_all_when_everything_filtered = true
end
