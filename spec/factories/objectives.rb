# frozen_string_literal: true

FactoryBot.define do
  factory :objective do
    title { Faker::DcComics.title }
    weight { rand(1..100) }
  end
end
