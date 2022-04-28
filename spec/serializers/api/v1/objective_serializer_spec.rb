# frozen_string_literal: true

RSpec.describe Api::V1::ObjectiveSerializer do
  describe '#as_json' do
    subject { JSON.parse(described_class.new(objective).to_json)['data']['attributes'] }

    let(:objective) { create(:objective) }

    it 'includes attributes' do
      expect(subject).to match(
        JSON.parse(
          {
            title: objective.title,
            weight: objective.weight,
            created_at: objective.created_at,
            updated_at: objective.updated_at
          }.to_json
        )
      )
    end
  end
end
