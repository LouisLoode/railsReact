RSpec.describe Api::V1::ObjectiveSerializer do
  describe '#as_json' do
    let!(:objective) { create(:objective) }
    subject { JSON.parse(described_class.new(objective).to_json)['data']['attributes'] }

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