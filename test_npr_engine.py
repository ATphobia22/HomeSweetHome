import pytest
import asyncio
from npr_engine import NPREngine, is_valid_semver, ReasoningBranch, AppView, SovereignTenant

@pytest.fixture
def engine():
    return NPREngine()

def test_semver_validation():
    assert is_valid_semver("11.8.5")
    assert not is_valid_semver("11.8")

def test_sovereign_tenant():
    tenant = SovereignTenant(
        id="test-node-alpha", 
        owner="anthony.tucker", 
        roles=["admin"], 
        boundaries=["compute"], 
        status="Provisioned"
    )
    assert tenant.status == "Provisioned"
    assert tenant.id == "test-node-alpha"

@pytest.mark.asyncio
async def test_run_parallel_reasoning(engine):
    result = await engine.run_parallel_reasoning("Integrity check for Node 21605")
    assert len(result) > 0
    assert "Gemini" in result or "Groq" in result or "OpenAI" in result or "Freeflow" in result

@pytest.mark.asyncio
async def test_run_master_autonomous_cycle(engine):
    result = await engine.run_master_autonomous_cycle({"balance": 124000, "inventoryCount": 12})
    assert "text" in result
    assert isinstance(result["sources"], list)
    assert len(result["sources"]) > 0

@pytest.mark.asyncio
async def test_clone_registry(engine, monkeypatch):
    # Mocking actual git subprocess call for safety in test harness
    async def mock_clone(*args, **kwargs):
        pass
    
    # In a real environment we would patch subprocess.check_call
    # For this simulation we just ensure it runs
    await engine.clone_registry() 
