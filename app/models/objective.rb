class Objective < ApplicationRecord
  validates :title, presence: true
  validates :weight, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 1,
    less_than_or_equal_to: 100
  }, unless: -> { weight.blank? }

  def self.weight_undefined?
    where(weight: nil).first.present?
  end

  def self.sum_not_equal_to_hundred?
    Objective.count(:weight).positive? && Objective.sum(:weight) != 100
  end
end
