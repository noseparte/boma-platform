package com.xmbl.ops.service.organization;

import com.xmbl.ops.dao.organization.impl.ResourcesDaoImpl;
import com.xmbl.ops.dao.organization.impl.ResourcesRoleDaoImpl;
import com.xmbl.ops.enumeration.EnumMenuType;
import com.xmbl.ops.model.organization.Resources;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;

@Service
public class ResourcesService {
    
    @Resource
	ResourcesDaoImpl resourcesDao;
    
    @Resource
	ResourcesRoleDaoImpl resourcesRoleDao;

    public List<Resources> getAllList(Integer roleId, boolean directoryOnly) {
        List<Resources> originList = resourcesDao.getResourceAllList();
        
        //标记角色状态
        if(roleId != null) originList = roleMark(roleId, originList);
        //只保留目录
        if(directoryOnly) originList = directoryFilter(originList);
        //标记层级树
        originList = levelTreeMark(originList);
        
        return originList;
    }
    
    private List<Resources> roleMark(Integer roleId, List<Resources> resourcesList) {
        
        for(Resources resource: resourcesList) {
            if (resourcesRoleDao.hasAuthentic(roleId, resource.getId()) >0 ){
                resource.setHasRole(true);
            }else {
                resource.setHasRole(false);
            }
        }
        
        return resourcesList;        
    }
    
    private List<Resources> directoryFilter(List<Resources> resourcesList) {
    	List<Resources> newResourcesList = new ArrayList<>();
    	
        for(Resources resource: resourcesList) {
        	if (resource.getType() == EnumMenuType.CATA.getId() || resource.getType() == EnumMenuType.PATH.getId()) {
        		newResourcesList.add(resource);
        	}
        }
        
        return newResourcesList;        
    }    
    
    private List<Resources> levelTreeMark(List<Resources> resourcesList) {
        
        String treeStr="";
        Integer currentParentId =0;
        Integer currentSort =0;
        LevelTree treeEntity = new LevelTree();
        Map<Integer,LevelTree> levelTree = new HashMap<>();
        
        //记录顶级目录
        treeEntity.order = 0;
        treeEntity.treeString = "";
        levelTree.put(0, treeEntity);
        
        for(Resources resource: resourcesList) {
            currentParentId = resource.getParentid();
            try{
            	
            	currentSort = levelTree.get(currentParentId).order +1;
            }catch(Exception e){
            	e.printStackTrace();
            }
            
            if(levelTree.get(currentParentId).treeString.equals("")) {
                treeStr = currentSort.toString();
            }else {
                treeStr = levelTree.get(currentParentId).treeString + "-" + currentSort.toString();
            }
            resource.setLevelTree(treeStr);
            treeEntity = new LevelTree();
            treeEntity.order = currentSort;
            treeEntity.treeString = levelTree.get(currentParentId).treeString;
            levelTree.put(currentParentId, treeEntity);
            
            //本层增加map
            treeEntity = new LevelTree();
            treeEntity.order = 0;
            treeEntity.treeString = resource.getLevelTree();
            levelTree.put(resource.getId(), treeEntity);
        }
        
        //排序
        Resources[] resourcesArray = new Resources[resourcesList.size()];
        resourcesList.toArray(resourcesArray);
        
        Arrays.sort(resourcesArray, new Comparator<Object>(){

        	@Override
        	public int compare(Object  o1, Object  o2) {
        		int result=0;
        		Resources r1 = (Resources) o1;
        		Resources r2 = (Resources) o2;
        		String tree1 = r1.getLevelTree();
        		String tree2 = r2.getLevelTree();
        		
        		String[] tree1Int = tree1.split("-");
        		String[] tree2Int = tree2.split("-");
        		
        		int loopCNT =tree1Int.length <= tree2Int.length? tree1Int.length:tree2Int.length;
        		
        		int compareValu1=0;
        		int compareValu2=0;
        		for (int i=0;i<loopCNT;i++) {
        			compareValu1 = Integer.parseInt(tree1Int[i]);
        			compareValu2 = Integer.parseInt(tree2Int[i]);
        			if(compareValu1 < compareValu2) {
        				result = -1;
        				break;
        			} else if(compareValu1 > compareValu2) {
        				result = 1;
        				break;
        			} else {
        				if (i+1 == loopCNT) {
        					if (loopCNT == tree1Int.length) result = -1;
        					if (loopCNT == tree2Int.length) result = 1;
        				}
        			}
        		}
        		return result;
        	}
        	
        });
        resourcesList = Arrays.asList(resourcesArray);
        
        return resourcesList;        
    }    
    
    @Transactional(value= "transactionManager", propagation = Propagation.REQUIRED, isolation = Isolation.READ_COMMITTED, rollbackFor = RuntimeException.class)
    public void commitEdit(String userKey, Integer id, String name, String resUrl, String resKey,String icon,
			Integer parentId, Byte status, Integer type, String description) {
    	Integer level;
    	Integer pid=null;
    	
    	if ( parentId == null ) {
    		parentId = 0;
    		level =1;
    	} else {
    		Resources parentsResource = resourcesDao.getResourcesById(parentId);
    		level = parentsResource.getLevel() + 1;
    	}
    	Resources resource = new Resources(userKey, id, name, resUrl, resKey,icon, parentId, status, pid, type, level, description);
    	if(id != null) {
    		resource.setParentid(null);
    		resource.setLevel(null);
    		resourcesDao.updateIfNecessary(resource);
    	} else {
    		pid = resourcesDao.getMaxPid(parentId);
    		if(pid ==null) {
    			pid =0;
    		} else {
    			pid++;
    		}
    		resource.setPid(pid);
    		resourcesDao.insertSelective(resource);
    	}
    	
    }
    
    public List<Resources> getResourcesbyRoleSign(String roleSign) {
        List<Resources> resources = resourcesDao.getResourcesbyRoleSign(roleSign);
        return resources;
    }

	public Resources getResourcesById(Integer Id) {
		Resources resources = resourcesDao.getResourcesById(Id);
		return resources;
	}   
	
	public boolean deleteResource(Integer rescId ,Integer deleteFlag)
	{
		if(resourcesDao.deleteResource(rescId, deleteFlag) == 1)
			return true;
		else
			return false;
	}
	
	public boolean deleteResourceRole(Integer rescId)
	{
		if(resourcesRoleDao.deleteResourceRole(rescId) == 1 )
			return true;
		else
			return false;
	}
	
	public List<Integer> searchChildId( Integer rescId)
	{
		List<Integer> ChildList = resourcesDao.searchChildId(rescId);
		return ChildList;
	}

}

class LevelTree {
    public Integer order;
    public String treeString;
}


class ResourceComparetor implements Comparator<Object> {

	@Override
	public int compare(Object  o1, Object  o2) {
		Resources r1 = (Resources) o1;
		Resources r2 = (Resources) o2;
		
		return r1.getLevelTree().compareTo(r2.getLevelTree());
	}
	
	
}
