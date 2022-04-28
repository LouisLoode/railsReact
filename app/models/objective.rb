class Objective < ApplicationRecord
  validates :title, presence: true
  validates :weight, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 100
  }
end
