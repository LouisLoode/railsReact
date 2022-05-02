# frozen_string_literal: true

RSpec.configure do |config|
  config.before do
    DatabaseCleaner.strategy = :truncation
  end

  config.after do
    DatabaseCleaner.clean
  end

  config.before(:suite) do
    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before do
    DatabaseCleaner.start
  end

  config.after do
    DatabaseCleaner.clean
  end
end
