FactoryBot.define do
  factory :objective do
    title { "MyAwesomeTitle" }
    weight {rand(1..100)}
  end
end
